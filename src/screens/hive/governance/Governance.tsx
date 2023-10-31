import ScreenToggle from 'components/ui/ScreenToggle';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {GovernanceNavigation} from 'navigators/MainDrawer.types';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
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
  const {theme} = useContext(ThemeContext);
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
        <ScreenToggle
          theme={theme}
          style={styles.toggle}
          additionalHeaderStyle={[
            getCardStyle(theme).roundedCardItem,
            styles.toogleHeader,
          ]}
          menu={[
            translate(`governance.menu.witness`),
            translate(`governance.menu.proxy`),
            translate(`governance.menu.proposals`),
          ]}
          toUpperCase={false}
          components={[
            <Witness user={user} focus={focus} theme={theme} />,
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
    toogleHeader: {
      width: '95%',
      alignSelf: 'center',
    },
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Governance);
