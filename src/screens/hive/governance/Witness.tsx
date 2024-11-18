import {loadAccount} from 'actions/hive';
import {Witness as WitnessInterface} from 'actions/interfaces';
import Vote from 'assets/governance/arrow_circle_up.svg';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import TwoFaModal from 'components/modals/TwoFaModal';
import {Caption} from 'components/ui/Caption';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TextStyle,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  default as SimpleToast,
  default as Toast,
} from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {AsyncUtils} from 'utils/async.utils';
import {getClient, voteForWitness} from 'utils/hive';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import ProxyUtils from 'utils/proxy';
import {MAX_WITNESS_VOTE, WITNESS_DISABLED_KEY} from 'utils/witness.utils';
import * as ValidUrl from 'valid-url';

type Props = {
  focus: number;
  theme: Theme;
  ranking: WitnessInterface[];
  rankingError?: boolean;
  isMultisig: boolean;
  twoFABots: {[botName: string]: string};
};

const Witness = ({
  user,
  loadAccount,
  focus,
  theme,
  ranking,
  rankingError,
  isMultisig,
  twoFABots,
}: PropsFromRedux & Props) => {
  const [displayVotedOnly, setDisplayVotedOnly] = useState(false);
  const [hideNonActive, setHideNonActive] = useState(true);
  const [remainingVotes, setRemainingVotes] = useState<string | number>('...');
  const [filteredRanking, setFilteredRanking] = useState<WitnessInterface[]>(
    [],
  );
  const [filterValue, setFilterValue] = useState('');
  const [votedWitnesses, setVotedWitnesses] = useState<string[]>([]);
  const [isVotingUnvotingForWitness, setIsVotingUnvotingForWitness] = useState(
    '',
  );

  const [usingProxy, setUsingProxy] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(true);
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles(width, height, theme);
  useEffect(() => {
    init();
  }, [focus]);

  const init = async () => {
    let proxy = await ProxyUtils.findUserProxy(user.account);
    setUsingProxy(proxy !== null);
    setRemainingVotes(MAX_WITNESS_VOTE - user.account.witnesses_voted_for);
    if (proxy) {
      initProxyVotes(proxy);
    } else {
      setVotedWitnesses(user.account.witness_votes);
    }
    setLoading(false);
  };

  useEffect(() => {
    setVotedWitnesses(user.account.witness_votes);
    setRemainingVotes(MAX_WITNESS_VOTE - user.account.witnesses_voted_for);
  }, [user]);

  useEffect(() => {
    setFilteredRanking(
      ranking.filter((witness) => {
        return (
          (witness.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
            witness.rank?.toLowerCase().includes(filterValue.toLowerCase())) &&
          ((displayVotedOnly && votedWitnesses.includes(witness.name)) ||
            !displayVotedOnly) &&
          ((hideNonActive && witness.signing_key !== WITNESS_DISABLED_KEY) ||
            !hideNonActive)
        );
      }),
    );
  }, [ranking, filterValue, displayVotedOnly, votedWitnesses, hideNonActive]);

  const initProxyVotes = async (proxy: string) => {
    const hiveAccounts = await getClient().database.getAccounts([proxy]);
    setVotedWitnesses(hiveAccounts[0].witness_votes);
  };

  const handleVotedButtonClick = async (witness: WitnessInterface) => {
    if (!user.keys.active) {
      Toast.show(translate('governance.witness.error.active'));
      return;
    }
    if (usingProxy) {
      SimpleToast.show(translate('governance.witness.using_proxy'));
      return;
    }
    const handleSubmit = async (options: TransactionOptions) => {
      if (user.account.witness_votes.includes(witness.name)) {
        setIsVotingUnvotingForWitness(witness.name);
        try {
          await voteForWitness(
            user.keys.active,
            {
              account: user.name,
              witness: witness.name,
              approve: false,
            },
            options,
          );
          await AsyncUtils.waitForXSeconds(3);
          loadAccount(user.name);
          if (!isMultisig)
            Toast.show(
              translate('governance.witness.success.unvote_wit', {
                name: witness.name,
              }),
            );
        } catch (err) {
          console.log(err);
          Toast.show(
            translate('governance.witness.error.unvote_wit', {
              name: witness.name,
            }),
          );
        } finally {
          setIsVotingUnvotingForWitness('');
        }
      } else {
        try {
          setIsVotingUnvotingForWitness(witness.name);
          await voteForWitness(
            user.keys.active,
            {
              account: user.name,
              witness: witness.name,
              approve: true,
            },
            options,
          );
          await AsyncUtils.waitForXSeconds(3);
          loadAccount(user.name);
          if (!isMultisig)
            Toast.show(
              translate('governance.witness.success.wit', {
                name: witness.name,
              }),
            );
        } catch (err) {
          Toast.show(
            translate('governance.witness.error.wit', {
              name: witness.name,
            }),
          );
        } finally {
          setIsVotingUnvotingForWitness('');
        }
      }
    };

    if (Object.entries(twoFABots).length > 0) {
      navigate('ModalScreen', {
        name: `2FA`,
        modalContent: (
          <TwoFaModal twoFABots={twoFABots} onSubmit={handleSubmit} />
        ),
      });
    } else {
      handleSubmit({
        multisig: isMultisig,
        fromWallet: true,
      });
    }
  };

  const renderWitnessItem = (witness: WitnessInterface, index: number) => {
    const votingUnvoting =
      isVotingUnvotingForWitness.trim().length > 0 &&
      isVotingUnvotingForWitness === witness.name;
    return (
      <View
        style={[getCardStyle(theme).defaultCardItem, styles.witnessItem]}
        key={`${witness.name}_${witness.rank}_${witness.active_rank}`}>
        <View style={styles.nameContainer}>
          <Icon name={Icons.AT} theme={theme} {...styles.iconBigger} />
          <Text
            style={[
              styles.text,
              styles.smallerText,
              styles.witnessName,
              witness.signing_key === WITNESS_DISABLED_KEY
                ? styles.inactive
                : undefined,
            ]}>
            {witness.name}
          </Text>
          {witness.url && ValidUrl.isWebUri(witness.url) ? (
            <View>
              <Icon
                name={Icons.OPEN}
                theme={theme}
                onPress={() => Linking.openURL(witness.url)}
                {...styles.iconBigger}
              />
            </View>
          ) : undefined}
        </View>
        <View style={styles.vote} />
        <View style={styles.voteButton}>
          {!votingUnvoting && (
            <Vote
              fill={
                votedWitnesses.includes(witness.name)
                  ? PRIMARY_RED_COLOR
                  : 'lightgrey'
              }
              onPress={() => handleVotedButtonClick(witness)}
            />
          )}
          {votingUnvoting && <Loader size={'small'} animating />}
        </View>
      </View>
    );
  };

  if (rankingError && !isLoading)
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.text}>
          {translate('governance.witness.error_retrieving_witness_ranking')}
        </Text>
      </View>
    );
  else if (!isLoading && !rankingError)
    return (
      <View style={styles.container}>
        <Caption
          text={
            usingProxy
              ? 'governance.witness.has_proxy'
              : 'governance.witness.remaining_votes'
          }
          textParams={
            usingProxy ? {proxy: user.account.proxy} : {remainingVotes}
          }
          additionnalText="governance.witness.link_to_arcange"
          additionnalTextOnClick={() =>
            Linking.openURL('https://hive.arcange.eu/witnesses')
          }
          additionnalTextStyle={{textDecorationLine: 'underline'} as TextStyle}
          hideSeparator
        />
        <OperationInput
          placeholder={translate('governance.witness.search_placeholder')}
          rightIcon={<Icon theme={theme} name={Icons.SEARCH} />}
          autoCapitalize="none"
          value={filterValue}
          onChangeText={setFilterValue}
        />
        <Separator height={15} />
        <View style={[styles.listFilterPanel]}>
          <CheckBoxPanel
            checked={displayVotedOnly}
            onPress={() => {
              setDisplayVotedOnly(!displayVotedOnly);
            }}
            title="governance.witness.show_voted"
            smallText
            containerStyle={{marginRight: 4, flex: 1}}
          />
          <CheckBoxPanel
            checked={hideNonActive}
            onPress={() => {
              setHideNonActive(!hideNonActive);
            }}
            title="governance.witness.hide_inactive"
            smallText
            containerStyle={{marginLeft: 4, flex: 1}}
          />
        </View>
        <FlatList
          data={filteredRanking}
          keyExtractor={(item) => item.name}
          renderItem={({item, index}) => renderWitnessItem(item, index)}
        />
      </View>
    );
  else
    return (
      <View style={styles.flexCentered}>
        <Loader animating size={'large'} />
      </View>
    );
};

const getDimensionedStyles = (width: number, height: number, theme: Theme) =>
  StyleSheet.create({
    listFilterPanel: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexGrow: 1,
      marginBottom: 6,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    text: {
      lineHeight: 16,
      textAlignVertical: 'center',
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...title_primary_title_1}.fontSize,
      ),
    },
    witnessItem: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 15,
      justifyContent: 'space-between',
      borderRadius: 33,
    },
    inactive: {textDecorationLine: 'line-through'},
    nameContainer: {flexDirection: 'row', alignItems: 'center'},
    witnessName: {
      lineHeight: 20,
      textAlignVertical: 'center',
      marginLeft: 10,
      marginRight: 10,
    },
    withPadding: {paddingHorizontal: width * 0.02},
    vote: {flex: 1},
    switch: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
      alignSelf: 'center',
    },
    textOpaque: {
      opacity: 0.7,
    },
    flex90: {
      width: '90%',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 12,
      height: 12,
    },
    iconBigger: {
      width: 18,
      height: 18,
    },
    checkbox: {
      backgroundColor: 'rgba(0,0,0,0)',
      width: '45%',
      padding: 10,
      borderColor: getColors(theme).senaryCardBorderColor,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 0,
      marginRight: 0,
    },
    smallerText: {fontSize: getFontSizeSmallDevices(width, 12)},
    voteButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    marginRight: {marginRight: 12},
    borderAligned: {
      borderRadius: 30,
      alignSelf: 'center',
      paddingHorizontal: 0,
      paddingVertical: 0,
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: 0,
    },
    inputContainer: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      borderBottomWidth: 0,
      alignContent: 'center',
      justifyContent: 'center',
      lineHeight: 22,
      paddingHorizontal: 10,
    },
    flexCentered: {flex: 1, justifyContent: 'center'},
  });

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
  };
};

const connector = connect(mapStateToProps, {loadAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Witness);
