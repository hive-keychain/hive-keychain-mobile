import {Witness as WitnessInterface} from 'actions/interfaces';
import keychain from 'api/keychain';
import Loader from 'components/ui/Loader';
import ScreenToggle from 'components/ui/ScreenToggle';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {GovernanceNavigation} from 'navigators/MainDrawer.types';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {default as Toast} from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';
import MyWitness from './MyWitness';
import Proposal from './Proposal';
import Proxy from './Proxy';
import Witness from './Witness';
//TODO handle error

interface GovernanceToScreenToogleProps {
  menuLabels: string[];
  components: JSX.Element[];
}

const Governance = ({
  user,
  navigation,
}: PropsFromRedux & {navigation: GovernanceNavigation}) => {
  const [ranking, setRanking] = useState<WitnessInterface[]>([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(useWindowDimensions());

  useLockedPortrait(navigation);
  const [focus, setFocus] = useState(Math.random());

  const [governanceComponents, setGovernanceComponents] = useState<
    GovernanceToScreenToogleProps
  >({
    menuLabels: [
      translate(`governance.menu.witness`),
      translate(`governance.menu.proxy`),
      translate(`governance.menu.proposals`),
    ],
    components: [
      <Witness user={user} focus={focus} theme={theme} />,
      <Proxy user={user} />,
      <Proposal user={user} />,
    ],
  });

  useEffect(() => {
    initWitnessRanking();
    const unsubscribe = navigation.addListener('focus', () => {
      setFocus(Math.random());
    });
    return unsubscribe;
  }, []);

  const initWitnessRanking = async () => {
    const requestResult = await keychain.get('/hive/v2/witnesses-ranks');
    if (requestResult.data !== '') {
      const ranking: WitnessInterface[] = requestResult.data;
      setRanking(ranking);
      if (
        ranking &&
        ranking.length > 0 &&
        ranking.find((witness) => witness.name === user.name!) !== undefined
      ) {
        const tempGovernanceComponents = governanceComponents;
        tempGovernanceComponents.components.push(
          <MyWitness
            theme={theme}
            witnessInfo={ranking.find((witness) => witness.name === user.name!)}
          />,
        );
        tempGovernanceComponents.menuLabels.push(
          translate(`governance.menu.my_witness`),
        );
        setGovernanceComponents(tempGovernanceComponents);
      }
    } else {
      Toast.show(
        translate('governance.witness.error.retrieving_witness_ranking'),
      );
      setHasError(true);
    }
    setLoading(false);
  };

  return (
    <WalletPage>
      <>
        {loading ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Loader animating size={'large'} />
          </View>
        ) : (
          <ScreenToggle
            theme={theme}
            style={styles.toggle}
            additionalHeaderStyle={[
              getCardStyle(theme).roundedCardItem,
              styles.toogleHeader,
            ]}
            menu={governanceComponents.menuLabels}
            toUpperCase={false}
            components={governanceComponents.components}
          />
        )}
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
