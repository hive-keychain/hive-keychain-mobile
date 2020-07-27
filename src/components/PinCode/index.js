import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import PinElement from './PinElement';
import PinCompletionIndicator from './PinCompletionIndicator';
import Separator from '../Separator';
import Toast from 'react-native-simple-toast';

const PinCode = ({
  height,
  children,
  signup,
  title,
  confirm,
  submit,
  navigation,
}) => {
  const config = [
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
  const [code, setCode] = useState([]);
  const [confirmCode, setConfirmCode] = useState([]);
  const [step, setStep] = useState(0);
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
    console.log(code);
    if (code.length === 6) {
      if (signup) {
        setStep(1);
      } else {
        console.log(code.join(''));
        submit(code.join(''), () => {
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
        Toast.show('PIN codes do not match');
        setStep(0);
        setCode([]);
        setConfirmCode([]);
      } else {
        submit(code.join(''));
      }
    }
  }, [code, confirmCode, signup, submit]);

  const onPressElement = (number, back) => {
    if (step === 0) {
      if ((number || number === 0) && code.length !== 6) {
        setCode([...code, number]);
      }
      if (back) {
        setCode(code.slice(0, -1));
      }
    } else {
      if ((number || number === 0) && confirmCode.length !== 6) {
        setConfirmCode([...confirmCode, number]);
      }
      if (back) {
        setConfirmCode(confirmCode.slice(0, -1));
      }
    }
  };
  console.log(code);
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
        {config.map((row) => (
          <View style={styles.row}>
            {row.map((elt) => (
              <PinElement onPressElement={onPressElement} {...elt} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
