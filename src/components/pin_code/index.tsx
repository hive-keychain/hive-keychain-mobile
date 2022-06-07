//import IntentLauncher from '@yz1311/react-native-intent-launcher';
import EllipticButton from 'components/form/EllipticButton';
import CustomModal from 'components/modals/CustomModal';
import Separator from 'components/ui/Separator';
import {SignupNavProp} from 'navigators/Signup.types';
import {UnlockNavigationProp} from 'navigators/Unlock.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {translate} from 'utils/localize';
import PinCompletionIndicator from './PinCompletionIndicator';
import PinElement from './PinElement';

interface Props {
  children: JSX.Element;
  signup?: boolean;
  title: string;
  confirm?: string;
  submit: (pin: string, callback?: (unsafe?: boolean) => void) => void;
  navigation: UnlockNavigationProp | SignupNavProp;
}

const PinCode = ({
  children,
  signup = false,
  title,
  confirm,
  submit,
  navigation,
}: Props) => {
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
      <Separator />
      {children}
      <Separator />
      <Text h4 style={styles.sub}>
        {h4}
      </Text>
      <Separator height={30} />
      <PinCompletionIndicator code={step === 0 ? code : confirmCode} />
      <Separator height={50} />
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
      </View>
      {false && (
        <CustomModal
          bottomHalf={true}
          outsideClick={() => {
            setVisible(false);
          }}>
          <Text style={styles.h4}>
            {translate('components.pinCode.unsupportedBiometrics.title')}
          </Text>
          <Separator />
          <Text>
            {translate('components.pinCode.unsupportedBiometrics.text1')}
          </Text>
          <Separator />
          <Text>
            {translate('components.pinCode.unsupportedBiometrics.text2')}
          </Text>
          <Separator height={50} />
          <EllipticButton
            title={translate('components.pinCode.unsupportedBiometrics.button')}
            onPress={() => {
              // IntentLauncher.startActivity({
              //   action: 'android.settings.SECURITY_SETTINGS',
              //   data: '',
              //   category: '',
              // });
              setVisible(false);
            }}
          />
        </CustomModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  h4: {fontWeight: 'bold', fontSize: 18},
  bgd: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub: {color: 'white'},
  container: {
    width: '80%',
    marginLeft: '10%',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {display: 'flex', flexDirection: 'row'},
});

export default PinCode;
