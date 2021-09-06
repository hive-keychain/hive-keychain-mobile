import {loadAccount} from 'actions/hive';
import ClaimIcon from 'assets/wallet/icon_reward.svg';
import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {toHP} from 'utils/format';
import {claimRewards} from 'utils/hive';
import {translate} from 'utils/localize';

const ClaimRewards = ({active, props, loadAccount}: PropsFromRedux) => {
  const {account, keys, name} = active;
  if (
    parseFloat(account.reward_hbd_balance + '') ||
    parseFloat(account.reward_hive_balance + '') ||
    parseFloat(account.reward_vesting_balance + '')
  )
    return (
      <TouchableOpacity
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
            const res = await claimRewards(keys.posting, {
              account: name,
              reward_hbd: account.reward_hbd_balance,
              reward_hive: account.reward_hive_balance,
              reward_vests: account.reward_vesting_balance,
            });
            console.log(res);
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
            console.log('error', e);
          }
        }}>
        <ClaimIcon width={25} height={25} />
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

const styles = StyleSheet.create({
  touchable: {alignItems: 'center', marginRight: 8},
});

export default connector(ClaimRewards);
