import {Witness as WitnessInterface} from 'actions/interfaces';
import keychain from 'api/keychain';
import Loader from 'components/ui/Loader';
import ScreenToggle from 'components/ui/ScreenToggle';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {GovernanceNavigation} from 'navigators/MainDrawer.types';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {default as Toast} from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';
import MyWitness from './MyWitness';
import Proposal from './Proposal';
import Proxy from './Proxy';
import Witness from './Witness';

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
  const styles = getDimensionedStyles(useWindowDimensions(), theme);

  useLockedPortrait(navigation);
  const [focus, setFocus] = useState(Math.random());

  const [governanceComponents, setGovernanceComponents] = useState<
    GovernanceToScreenToogleProps
  >({menuLabels: [], components: []});

  useEffect(() => {
    initWitnessRanking();
    const unsubscribe = navigation.addListener('focus', () => {
      setFocus(Math.random());
    });
    return unsubscribe;
  }, []);

  const initWitnessRanking = async () => {
    try {
      const requestResult = await keychain.get('/hive/v2/witnesses-ranks');
      if (requestResult.data !== '' || !!requestResult) {
        const ranking: WitnessInterface[] = requestResult.data;
        setRanking(ranking);
        const tempGovernanceComponents = {
          menuLabels: [
            translate(`governance.menu.witness`),
            translate(`governance.menu.proxy`),
            translate(`governance.menu.proposals`),
          ],
          components: [
            <Witness
              user={user}
              focus={focus}
              theme={theme}
              ranking={ranking}
              rankingError={hasError}
            />,
            <Proxy user={user} />,
            <Proposal user={user} />,
          ],
        };
        if (
          ranking &&
          ranking.length > 0 &&
          ranking.find((witness) => witness.name === user.name!) !== undefined
        ) {
          tempGovernanceComponents.components.push(
            <MyWitness
              theme={theme}
              ranking={ranking.find((witness) => witness.name === user.name!)}
            />,
          );
          tempGovernanceComponents.menuLabels.push(
            translate(`governance.menu.my_witness`),
          );
        }
        setGovernanceComponents(tempGovernanceComponents);
      } else {
        setHasError(true);
        throw new Error('Witness-ranks data error');
      }
    } catch (error) {
      Toast.show(
        translate('governance.witness.error.retrieving_witness_ranking'),
      );
    }
    setLoading(false);
  };

  return (
    <WalletPage>
      <>
        {loading ? (
          <View style={styles.flexCentered}>
            <Loader animating size={'large'} />
          </View>
        ) : hasError || governanceComponents.components.length === 0 ? (
          <View style={styles.flexCentered}>
            <Text style={styles.text}>
              {translate('governance.witness.error.retrieving_witness_ranking')}
            </Text>
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

const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    toggle: {
      display: 'flex',
      flexDirection: 'row',
    },
    toogleHeader: {
      width: '95%',
      alignSelf: 'center',
    },
    text: {
      lineHeight: 16,
      textAlignVertical: 'center',
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      textAlign: 'center',
    },
    flexCentered: {flex: 1, justifyContent: 'center'},
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Governance);
