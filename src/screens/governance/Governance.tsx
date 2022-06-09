import ScreenToggle from 'components/ui/ScreenToggle';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';
import Proposal from './Proposal';
import Proxy from './Proxy';
import Witness from './Witness';

const Governance = ({
  user,
  navigation,
}: PropsFromRedux & {navigation: WalletNavigation}) => {
  const styles = getDimensionedStyles(useWindowDimensions());

  useLockedPortrait(navigation);

  return (
    <WalletPage>
      <>
        <ScreenToggle
          style={styles.toggle}
          menu={[
            translate(`wallet.menu.hive`),
            translate(`wallet.menu.history`),
            translate(`wallet.menu.tokens`),
          ]}
          toUpperCase
          components={[
            <Witness user={user} />,
            <Proxy user={user} />,
            <Proposal user={user} />,
          ]}
        />
      </>
    </WalletPage>
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    toggle: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
    },
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Governance);
