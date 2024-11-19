import React from 'react';
import {View} from 'react-native';
import {translate} from 'utils/localize';
import OperationInput from './OperationInput';

type Props = {
  twoFABots: {[botName: string]: string};
  setTwoFABots: React.Dispatch<
    React.SetStateAction<{[botName: string]: string}>
  >;
};
const TwoFaForm = ({twoFABots, setTwoFABots}: Props) => {
  return (
    <>
      {twoFABots && Object.keys(twoFABots).length > 0 && (
        <View style={{flex: 1}}>
          {Object.entries(twoFABots).map(([botName, code]) => (
            <OperationInput
              keyboardType="numeric"
              labelInput={translate('multisig.bot_two_fa_code', {
                account: botName,
              })}
              value={code}
              onChangeText={(value) => {
                setTwoFABots((old) => {
                  return {...old, [botName]: value};
                });
              }}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default TwoFaForm;
