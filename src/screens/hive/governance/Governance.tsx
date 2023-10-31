import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import ScreenToggle from 'components/ui/ScreenToggle';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {GovernanceNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';
import Proposal from './Proposal';
import Proxy from './Proxy';
import Witness from './Witness';
//TODO work with mywitness part, should open if witness account detected as the extension does.
const Governance = ({
  user,
  navigation,
}: PropsFromRedux & {navigation: GovernanceNavigation}) => {
  const styles = getDimensionedStyles(useWindowDimensions());

  useLockedPortrait(navigation);
  const [focus, setFocus] = useState(Math.random());
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFocus(Math.random());
    });
    return unsubscribe;
  }, []);

  return (
    <WalletPage>
      <>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />
        <ScreenToggle
          style={styles.toggle}
          menu={[
            translate(`governance.menu.witnesses`),
            translate(`governance.menu.proxy`),
            translate(`governance.menu.proposals`),
          ]}
          toUpperCase
          components={[
            <Witness user={user} focus={focus} />,
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
    },
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Governance);
