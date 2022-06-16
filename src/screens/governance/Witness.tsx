import {loadAccount} from 'actions/hive';
import {ActiveAccount, Witness as WitnessInterface} from 'actions/interfaces';
import keychain from 'api/keychain';
import Vote from 'assets/governance/arrow_circle_up.svg';
import Clear from 'assets/governance/clear.svg';
import Open from 'assets/governance/open_in_new.svg';
import CustomInput from 'components/form/CustomInput';
import {RadioButton} from 'components/form/CustomRadioGroup';
import Loader from 'components/ui/Loader';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  default as SimpleToast,
  default as Toast,
} from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {getClient, voteForWitness} from 'utils/hive';
import {translate} from 'utils/localize';
import ProxyUtils from 'utils/proxy';
import * as ValidUrl from 'valid-url';
const MAX_WITNESS_VOTE = 30;

type Props = {
  user: ActiveAccount;
  focus: number;
};

const Witness = ({user, loadAccount, focus}: PropsFromRedux & Props) => {
  const [displayVotedOnly, setDisplayVotedOnly] = useState(false);
  const [hideNonActive, setHideNonActive] = useState(true);
  const [remainingVotes, setRemainingVotes] = useState<string | number>('...');
  const [ranking, setRanking] = useState<WitnessInterface[]>([]);
  const [filteredRanking, setFilteredRanking] = useState<WitnessInterface[]>(
    [],
  );
  const [filterValue, setFilterValue] = useState('');
  const [votedWitnesses, setVotedWitnesses] = useState<string[]>([]);

  const [usingProxy, setUsingProxy] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const styles = getDimensionedStyles(useWindowDimensions());

  useEffect(() => {
    init();
  }, [focus]);

  const init = async () => {
    let proxy = await ProxyUtils.findUserProxy(user.account);
    setUsingProxy(proxy !== null);

    setRemainingVotes(MAX_WITNESS_VOTE - user.account.witnesses_voted_for);

    initWitnessRanking();
    if (proxy) {
      initProxyVotes(proxy);
    } else {
      setVotedWitnesses(user.account.witness_votes);
    }
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
          ((hideNonActive &&
            witness.signing_key !==
              'STM1111111111111111111111111111111114T1Anm') ||
            !hideNonActive)
        );
      }),
    );
  }, [ranking, filterValue, displayVotedOnly, votedWitnesses, hideNonActive]);

  const initProxyVotes = async (proxy: string) => {
    const hiveAccounts = await getClient().database.getAccounts([proxy]);
    setVotedWitnesses(hiveAccounts[0].witness_votes);
  };

  const initWitnessRanking = async () => {
    const requestResult = await keychain.get('/hive/v2/witnesses-ranks');
    if (requestResult.data !== '') {
      const ranking = requestResult.data;
      setRanking(ranking);
      setFilteredRanking(ranking);
    } else {
      Toast.show(
        translate('governance.witness.error.retrieving_witness_ranking'),
      );
      setHasError(true);
    }
    setLoading(false);
  };

  const handleVotedButtonClick = async (witness: WitnessInterface) => {
    if (usingProxy) {
      SimpleToast.show(translate('governance.witness.using_proxy'));
      return;
    }
    if (user.account.witness_votes.includes(witness.name)) {
      try {
        await voteForWitness(user.keys.active, {
          account: user.name,
          witness: witness.name,
          approve: false,
        });
        loadAccount(user.name);
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
      }
    } else {
      try {
        await voteForWitness(user.keys.active, {
          account: user.name,
          witness: witness.name,
          approve: true,
        });
        loadAccount(user.name);
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
      }
    }
  };

  const renderWitnessItem = (witness: WitnessInterface, index: number) => {
    return (
      <View
        style={[styles.witnessItem, index % 2 === 0 ? styles.even : undefined]}
        key={`${witness.name}_${witness.rank}_${witness.active_rank}`}>
        <View style={styles.rank}>
          <Text style={styles.activeRank}>
            {witness.active_rank ? witness.active_rank : '-'}{' '}
          </Text>
          {!hideNonActive &&
            witness.active_rank?.toString() !== witness.rank && (
              <Text style={styles.includingInactive}>({witness.rank})</Text>
            )}
        </View>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.witnessName,
              witness.signing_key ===
              'STM1111111111111111111111111111111114T1Anm'
                ? styles.inactive
                : undefined,
            ]}>
            @{witness.name}
          </Text>
          {witness.url && ValidUrl.isWebUri(witness.url) ? (
            <View>
              <Open
                onPress={() => Linking.openURL(witness.url)}
                fill="black"
                width={16}
              />
            </View>
          ) : undefined}
        </View>
        <View style={styles.vote} />
        <Vote
          fill={votedWitnesses.includes(witness.name) ? 'black' : 'lightgrey'}
          onPress={() => handleVotedButtonClick(witness)}
        />
      </View>
    );
  };

  if (isLoading)
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Loader animating />
      </View>
    );
  else
    return (
      <View style={styles.container}>
        <View style={styles.withPadding}>
          {!usingProxy && (
            <Text style={styles.text}>
              {translate('governance.witness.remaining_votes', {
                remainingVotes,
              })}
            </Text>
          )}
          {usingProxy && (
            <Text style={styles.text}>
              {translate('governance.witness.has_proxy', {
                proxy: user.account.proxy,
              })}
            </Text>
          )}
          <Text style={styles.text}>
            {translate('governance.witness.link_to_arcange', {
              proxy: user.account.proxy,
            })}
            <Open
              height={12}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() =>
                Linking.openURL('https://hive.arcange.eu/witnesses')
              }
              fill="black"
            />
          </Text>

          <CustomInput
            placeholder={translate('governance.witness.search_placeholder')}
            inputColor="black"
            backgroundColor="white"
            containerStyle={{marginLeft: 0, marginVertical: 10}}
            rightIcon={
              filterValue.length ? (
                <TouchableOpacity
                  onPress={() => {
                    setFilterValue('');
                  }}>
                  <Clear width={16} />
                </TouchableOpacity>
              ) : undefined
            }
            autoCapitalize="none"
            value={filterValue}
            onChangeText={setFilterValue}
          />
        </View>
        <View style={styles.switch}>
          <RadioButton
            label={translate('governance.witness.show_voted')}
            selected={displayVotedOnly}
            onSelect={() => {
              setDisplayVotedOnly(!displayVotedOnly);
            }}
          />
          <RadioButton
            label={translate('governance.witness.hide_inactive')}
            selected={hideNonActive}
            onSelect={() => {
              setHideNonActive(!hideNonActive);
            }}
          />
        </View>
        <FlatList
          data={filteredRanking}
          keyExtractor={(item) => item.name}
          renderItem={({item, index}) => renderWitnessItem(item, index)}
        />
      </View>
    );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    container: {width: '100%', flex: 1, marginTop: 30},
    text: {
      marginBottom: 10,
      fontSize: 16,
      lineHeight: 16,
      textAlignVertical: 'center',
    },
    witnessItem: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignContent: 'flex-end',
    },
    rank: {
      flexDirection: 'row',
      height: '100%',
      width: 44,
      textVertical: 'center',
      alignContent: 'center',
      justifyContent: 'space-around',
    },
    activeRank: {
      width: 20,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 12,
      lineHeight: 20,
    },
    includingInactive: {
      width: 24,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 10,
      lineHeight: 20,
    },
    inactive: {textDecorationLine: 'line-through'},
    nameContainer: {flexDirection: 'row'},
    witnessName: {
      marginLeft: 20,
      paddingRight: 10,
      lineHeight: 20,
      textAlignVertical: 'center',
    },
    even: {backgroundColor: 'white'},
    withPadding: {paddingHorizontal: width * 0.05},
    vote: {flex: 1},
    switch: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 20,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {loadAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Witness);
