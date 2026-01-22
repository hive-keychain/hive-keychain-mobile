import { NavigationProp, ParamListBase } from '@react-navigation/native';
import EllipticButton from 'components/form/EllipticButton';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { Text } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { Theme } from 'src/context/theme.context';
import { Width } from 'src/interfaces/common.interface';
import {
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import { generateBoxShadowStyle } from 'src/styles/shadow';
import { getSpaceAdjustMultiplier, getSpacing } from 'src/styles/spacing';
import {
  body_primary_body_3,
  button_link_primary_medium,
  headlines_primary_headline_1,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import { translate } from 'utils/localize';
import { navigate } from 'utils/navigation.utils';
import PinCompletionIndicator from './PinCompletionIndicator';
import PinElement from './PinElement';

interface Props {
  children: React.ReactNode;
  infoPin?: React.ReactNode;
  infoPinContainerStyle?: StyleProp<ViewStyle>;
  signup?: boolean;
  mode?: 'unlock' | 'signup' | 'changePin';
  title: string;
  confirm?: string;
  newTitle?: string;
  submit: (pin: string, callback?: (unsafe?: boolean) => void) => void;
  verifyCurrentPin?: (pin: string) => Promise<boolean>;
  navigation: NavigationProp<ParamListBase>;
  theme: Theme;
}

const PinCode = ({
  children,
  signup = false,
  mode,
  title,
  confirm,
  newTitle,
  submit,
  verifyCurrentPin,
  navigation,
  theme,
  infoPin,
  infoPinContainerStyle,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width});
  const spaced = getSpaceAdjustMultiplier(width, height);
  const flow = mode ?? (signup ? 'signup' : 'unlock');
  interface PinItem {
    refNumber: number;
    number?: number;
    helper?: string;
    back?: boolean;
  }
  const config: PinItem[][] = [
    [
      {refNumber: 1, number: 1},
      {refNumber: 2, number: 2, helper: 'A B C'},
      {refNumber: 3, number: 3, helper: 'D E F'},
    ],
    [
      {refNumber: 4, number: 4, helper: 'G H I'},
      {refNumber: 5, number: 5, helper: 'J K L'},
      {refNumber: 6, number: 6, helper: 'M N O'},
    ],
    [
      {refNumber: 7, number: 7, helper: 'P Q R S'},
      {refNumber: 8, number: 8, helper: 'T U V'},
      {refNumber: 9, number: 9, helper: 'W X Y Z'},
    ],
    [{refNumber: 10}, {refNumber: 11, number: 0}, {refNumber: 12, back: true}],
  ];
  const [code, setCode] = useState<string[]>([]);
  const [confirmCode, setConfirmCode] = useState<string[]>([]);
  const [pendingPin, setPendingPin] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setStep(0);
      setCode([]);
      setConfirmCode([]);
      setPendingPin(null);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (code.length === 6) {
      if (flow === 'changePin') {
        const entry = code.join('');
        if (step === 0) {
          const verify = verifyCurrentPin ?? (async () => false);
          verify(entry)
            .then((isValid) => {
              if (!isValid) {
                Toast.show(translate('toast.authFailed'), {
                  duration: Toast.durations.LONG,
                });
                setCode([]);
                return;
              }
              setStep(1);
              setCode([]);
            })
            .catch(() => {
              Toast.show(translate('toast.authFailed'), {
                duration: Toast.durations.LONG,
              });
              setCode([]);
            });
          return;
        }
        if (step === 1) {
          setPendingPin(entry);
          setStep(2);
          setCode([]);
          return;
        }
        if (step === 2) {
          if (pendingPin !== entry) {
            Toast.show(translate('toast.noMatch'));
            setStep(1);
            setPendingPin(null);
            setCode([]);
            return;
          }
          submit(entry);
          return;
        }
      } else if (flow === 'signup') {
        setStep(1);
      } else {
        submit(code.join(''), (unsafeBiometrics) => {
          if (unsafeBiometrics) {
            setVisible(true);
          }
          setCode([]);
        });
      }
    }
    if (flow === 'signup' && confirmCode.length === 6) {
      if (
        !(
          confirmCode.length === code.length &&
          confirmCode.every((value, index) => value === code[index])
        )
      ) {
        Toast.show(translate('toast.noMatch'));
        setStep(0);
        setCode([]);
        setConfirmCode([]);
      } else {
        submit(code.join(''));
      }
    }
  }, [
    code,
    confirmCode,
    flow,
    pendingPin,
    step,
    submit,
    verifyCurrentPin,
  ]);

  useEffect(() => {
    if (visible) {
      navigate('ModalScreen', {
        modalContent: (
          <View
            style={{
              height: '100%',
              width: '100%',
            }}>
            <Text style={styles.h4}>
              {translate('components.pinCode.unsupportedBiometrics.title')}
            </Text>
            <Separator />
            <Text style={styles.text}>
              {translate('components.pinCode.unsupportedBiometrics.text1')}
            </Text>
            <Separator />
            <Text style={styles.text}>
              {translate('components.pinCode.unsupportedBiometrics.text2')}
            </Text>
            <Separator height={40} />
            <EllipticButton
              title={translate(
                'components.pinCode.unsupportedBiometrics.button',
              )}
              onPress={() => {
                Linking.openSettings();
                setVisible(false);
              }}
              style={[
                styles.warningProceedButton,
                generateBoxShadowStyle(
                  0,
                  13,
                  RED_SHADOW_COLOR,
                  1,
                  25,
                  30,
                  RED_SHADOW_COLOR,
                ),
              ]}
              additionalTextStyle={{...button_link_primary_medium}}
            />
          </View>
        ),

        modalContainerStyle: {
          backgroundColor: getColors(theme).primaryBackground,
          borderColor: getColors(theme).cardBorderColor,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderWidth: 1,
          borderRadius: 22,
        } as StyleProp<ViewStyle>,
        fixedHeight: 0.4,
      });
    }
  }, [visible]);

  const onPressElement = (number: number | undefined, back?: boolean) => {
    if (flow === 'changePin') {
      if ((number || number === 0) && code.length !== 6) {
        setCode([...code, number + '']);
      }
      if (back) {
        setCode(code.slice(0, -1));
      }
      return;
    }
    if (step === 0) {
      if ((number || number === 0) && code.length !== 6) {
        setCode([...code, number + '']);
      }
      if (back) {
        setCode(code.slice(0, -1));
      }
    } else {
      if ((number || number === 0) && confirmCode.length !== 6) {
        setConfirmCode([...confirmCode, number + '']);
      }
      if (back) {
        setConfirmCode(confirmCode.slice(0, -1));
      }
    }
  };
  let h4;
  if (flow === 'changePin') {
    if (step === 0) {
      h4 = title;
    } else if (step === 1) {
      h4 = newTitle || title;
    } else {
      h4 = confirm || title;
    }
  } else if (flow === 'signup') {
    h4 = step === 0 ? title : confirm;
  } else {
    h4 = title;
  }
  return (
    <View style={styles.bgd}>
      <FocusAwareStatusBar
        backgroundColor={getColors(theme).primaryBackground}
        barStyle={theme === Theme.DARK ? 'light-content' : 'dark-content'}
      />
      <View style={[styles.centeredView]}>
        <Separator height={height * spaced.spaceBase} />
        {children}
      </View>
      <View>
        <View style={styles.centeredView}>
          <Text style={styles.sub}>{h4}</Text>
          <Separator height={height * spaced.spaceBase} />
          <PinCompletionIndicator
            code={flow === 'changePin' ? code : step === 0 ? code : confirmCode}
            theme={theme}
          />
        </View>
        <Separator height={height * spaced.adjustMultiplier * 0.02} />
        <View style={styles.container}>
          {config.map((row, i) => (
            <View key={i.toString()} style={styles.row}>
              {row.map((elt, j: number) => (
                <PinElement
                  key={j.toString()}
                  onPressElement={onPressElement}
                  {...elt}
                />
              ))}
            </View>
          ))}
          {infoPin && <View style={infoPinContainerStyle}>{infoPin}</View>}
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: Theme, {width}: Width) =>
  StyleSheet.create({
    h4: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
      textAlign: 'center',
      marginTop: 10,
    },
    bgd: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    sub: {
      color: getColors(theme).secondaryText,
      opacity: 0.7,
      ...headlines_primary_headline_1,
    },
    container: {
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
    },
    text: {
      ...body_primary_body_3,
      textAlign: 'center',
      marginHorizontal: getSpacing(width).mainMarginHorizontal,
      color: getColors(theme).secondaryText,
    },
    centeredView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default PinCode;
