import {KeyTypes, Witness as WitnessInterface} from 'actions/interfaces';
import keychain from 'api/keychain';
import Background from 'components/ui/Background';
import Loader from 'components/ui/Loader';
import ScreenToggle from 'components/ui/ScreenToggle';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {GovernanceNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Toast from 'react-native-root-toast';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import Proposal from './Proposal';
import Proxy from './Proxy';
import Witness from './Witness';
import MyWitness from './myWitness/MyWitness';

interface GovernanceToScreenToogleProps {
  menuLabels: string[];
  components: React.ReactNode[];
}

const Governance = ({
  user,
  navigation,
}: PropsFromRedux & {navigation: GovernanceNavigation}) => {
  const [ranking, setRanking] = useState<WitnessInterface[]>([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  const [isMultisig, twoFABots] = useCheckForMultisig(KeyTypes.active, user);
  useLockedPortrait(navigation);
  const [focus, setFocus] = useState(Math.random());

  const [myWit, setMyWit] = useState(false);

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

        if (
          ranking &&
          ranking.length > 0 &&
          ranking.find((witness) => witness.name === user.name!) !== undefined
        ) {
          setMyWit(true);
        }
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
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      <>
        {loading ? (
          <View style={styles.flexCentered}>
            <Loader animating size={'large'} />
          </View>
        ) : hasError ? (
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
            menu={[
              translate(`governance.menu.witness`),
              translate(`governance.menu.proxy`),
              translate(`governance.menu.proposals`),
              myWit && translate(`governance.menu.my_witness`),
            ].filter((e) => !!e)}
            toUpperCase={false}
            components={[
              <Witness
                focus={focus}
                theme={theme}
                ranking={ranking}
                rankingError={hasError}
                isMultisig={isMultisig}
                twoFABots={twoFABots}
              />,
              <Proxy isMultisig={isMultisig} twoFABots={twoFABots} />,
              <Proposal isMultisig={isMultisig} twoFABots={twoFABots} />,
              myWit && (
                <MyWitness
                  theme={theme}
                  ranking={ranking.find(
                    (witness) => witness.name === user.name!,
                  )}
                />
              ),
            ]}
            addShadowItem
          />
        )}
      </>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    toggle: {
      display: 'flex',
      flexDirection: 'row',
    },
    toogleHeader: {
      width: '95%',
      alignSelf: 'center',
      alignItems: 'center',
    },
    text: {
      lineHeight: 16,
      textAlignVertical: 'center',
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      textAlign: 'center',
      fontSize: getFontSizeSmallDevices(
        width,
        {...title_primary_title_1}.fontSize,
      ),
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
