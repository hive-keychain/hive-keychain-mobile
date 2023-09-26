//import IntentLauncher from '@yz1311/react-native-intent-launcher';
import EllipticButton from 'components/form/EllipticButton';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import {SignupNavigation} from 'navigators/Signup.types';
import {UnlockNavigation} from 'navigators/Unlock.types';
import React, {useEffect, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Text} from 'react-native-elements';
import IntentLauncher from 'react-native-intent-launcher';
import Toast from 'react-native-simple-toast';
import {Theme} from 'src/context/theme.context';
import {
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {getSpaceAdjustMultiplier, getSpacing} from 'src/styles/spacing';
import {
  body_primary_body_3,
  button_link_primary_medium,
  headlines_primary_headline_1,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import PinCompletionIndicator from './PinCompletionIndicator';
import PinElement from './PinElement';

interface Props {
  children: JSX.Element;
  infoPin?: JSX.Element;
  infoPinContainerStyle?: StyleProp<ViewStyle>;
  signup?: boolean;
  title: string;
  confirm?: string;
  submit: (pin: string, callback?: (unsafe?: boolean) => void) => void;
  navigation: UnlockNavigation | SignupNavigation;
  //TODO after refactoring UI change to fixed param
  theme?: Theme;
}

const PinCode = ({
  children,
  signup = false,
  title,
  confirm,
  submit,
  navigation,
  theme,
  infoPin,
  infoPinContainerStyle,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width});
  const spaced = getSpaceAdjustMultiplier(width, height);
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
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setStep(0);
      setCode([]);
      setConfirmCode([]);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (code.length === 6) {
      if (signup) {
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
    if (confirmCode.length === 6) {
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
  }, [code, confirmCode, signup, submit]);

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
                IntentLauncher.startActivity({
                  action: 'android.settings.SECURITY_SETTINGS',
                });
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
  if (!signup || step === 0) {
    h4 = title;
  } else {
    h4 = confirm;
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
            code={step === 0 ? code : confirmCode}
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
