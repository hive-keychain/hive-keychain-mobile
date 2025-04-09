import {loadAccount} from 'actions/hive';
import {KeyTypes} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {RootState} from 'store';
import {toHP} from 'utils/format';
import {claimRewards} from 'utils/hive';
import {translate} from 'utils/localize';

interface Props {
  theme: Theme;
}

const ClaimRewards = ({
  active,
  props,
  loadAccount,
  theme,
}: PropsFromRedux & Props) => {
  const {account, keys, name} = active;
  const styles = getStyles(theme);
  const [isMultisig] = useCheckForMultisig(KeyTypes.posting, active);
  if (
    parseFloat(account.reward_hbd_balance + '') ||
    parseFloat(account.reward_hive_balance + '') ||
    parseFloat(account.reward_vesting_balance + '')
  )
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchable}
        onPress={async () => {
          if (!keys.posting) {
            SimpleToast.show(
              translate('wallet.claim.error_posting'),
              SimpleToast.LONG,
            );
            return;
          }
          try {
            const res = await claimRewards(
              keys.posting,
              {
                account: name,
                reward_hbd: account.reward_hbd_balance,
                reward_hive: account.reward_hive_balance,
                reward_vests: account.reward_vesting_balance,
              },
              {multisig: isMultisig, fromWallet: true} as TransactionOptions,
            );
            if (res) {
              const rewards = [
                account.reward_hbd_balance,
                account.reward_hive_balance,
                `${toHP(
                  account.reward_vesting_balance + '',
                  props.globals,
                ).toFixed(3)} HP`,
              ].filter((e) => parseFloat(e + ''));
              let str;
              if (rewards.length > 1)
                str =
                  rewards.slice(0, -1).join(',') + ' and ' + rewards.slice(-1);
              else str = rewards[0];
              SimpleToast.show(
                translate('wallet.claim.success', {rewards: str}),
                SimpleToast.LONG,
              );
              loadAccount(name);
            }
          } catch (e) {
            SimpleToast.show(
              translate('common.error', {msg: e}),
              SimpleToast.LONG,
            );
          }
        }}>
        <Icon
          theme={theme}
          name={Icons.INTEREST}
          color={PRIMARY_RED_COLOR}
          width={15}
          height={15}
        />
      </TouchableOpacity>
    );
  else return null;
};

const mapStateToProps = (state: RootState) => {
  return {
    active: state.activeAccount,
    props: state.properties,
  };
};

const connector = connect(mapStateToProps, {loadAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    touchable: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      borderRadius: 50,
      padding: 4,
      height: 25,
      width: 25,
      backgroundColor: 'white',
    },
  });

export default connector(ClaimRewards);
