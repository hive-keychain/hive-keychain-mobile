import {loadAccount} from 'actions/hive';
import {ActiveAccount, Witness as WitnessInterface} from 'actions/interfaces';
import Vote from 'assets/governance/arrow_circle_up.svg';
import CustomInput from 'components/form/CustomInput';
import Icon from 'components/hive/Icon';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {
  default as SimpleToast,
  default as Toast,
} from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_HEIGHT_SUPPORTED,
  getFontSizeSmallDevices,
  title_primary_title_1,
} from 'src/styles/typography';
import {capitalizeSentence} from 'utils/format';
import {getClient, voteForWitness} from 'utils/hive';
import {translate} from 'utils/localize';
import ProxyUtils from 'utils/proxy';
import {MAX_WITNESS_VOTE, WITNESS_DISABLED_KEY} from 'utils/witness.utils';
import * as ValidUrl from 'valid-url';

type Props = {
  user: ActiveAccount;
  focus: number;
  theme: Theme;
  ranking: WitnessInterface[];
  rankingError?: boolean;
};

const Witness = ({
  user,
  loadAccount,
  focus,
  theme,
  ranking,
  rankingError,
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
    if (user.account.witness_votes.includes(witness.name)) {
      setIsVotingUnvotingForWitness(witness.name);
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
      } finally {
        setIsVotingUnvotingForWitness('');
      }
    } else {
      try {
        setIsVotingUnvotingForWitness(witness.name);
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
      } finally {
        setIsVotingUnvotingForWitness('');
      }
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
                onClick={() => Linking.openURL(witness.url)}
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
                votedWitnesses.includes(witness.name) ? 'black' : 'lightgrey'
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
        <View style={styles.flex90}>
          {!usingProxy && (
            <Text style={[styles.text, styles.withPadding]}>
              {translate('governance.witness.remaining_votes', {
                remainingVotes,
              })}
            </Text>
          )}
          {usingProxy && (
            <Text style={styles.text}>
              {capitalizeSentence(
                translate('governance.witness.has_proxy', {
                  proxy: user.account.proxy,
                }),
              )}
            </Text>
          )}
          <Separator />
          <Text style={[styles.text, styles.textOpaque, styles.marginRight]}>
            {capitalizeSentence(
              translate('governance.witness.link_to_arcange', {
                proxy: user.account.proxy,
              }),
            )}
            <Icon
              name={Icons.OPEN}
              theme={theme}
              onClick={() =>
                Linking.openURL('https://hive.arcange.eu/witnesses')
              }
              {...styles.icon}
            />
          </Text>
        </View>
        <Separator />
        <CustomInput
          placeholder={translate('governance.witness.search_placeholder')}
          rightIcon={<Icon theme={theme} name={Icons.SEARCH} />}
          autoCapitalize="none"
          value={filterValue}
          onChangeText={setFilterValue}
          containerStyle={[
            getCardStyle(theme).defaultCardItem,
            styles.borderAligned,
          ]}
          inputStyle={[styles.text]}
          inputContainerStyle={styles.inputContainer}
          makeExpandable={
            height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED ? true : false
          }
        />
        <Separator height={15} />
        <View style={styles.switch}>
          <CheckBox
            checked={displayVotedOnly}
            onPress={() => {
              setDisplayVotedOnly(!displayVotedOnly);
            }}
            title={
              <Text
                style={[styles.text, styles.smallerText, styles.textOpaque]}>
                {translate('governance.witness.show_voted')}
              </Text>
            }
            containerStyle={styles.checkbox}
            checkedColor={getColors(theme).icon}
          />
          <CheckBox
            checked={hideNonActive}
            onPress={() => {
              setHideNonActive(!hideNonActive);
            }}
            title={
              <Text
                style={[styles.text, styles.smallerText, styles.textOpaque]}>
                {translate('governance.witness.hide_inactive')}
              </Text>
            }
            containerStyle={styles.checkbox}
            checkedColor={getColors(theme).icon}
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
    container: {
      width: '100%',
      flex: 1,
      marginTop: 30,
      justifyContent: 'center',
    },
    text: {
      lineHeight: 16,
      textAlignVertical: 'center',
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        height,
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
      width: '100%',
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
    smallerText: {fontSize: getFontSizeSmallDevices(height, 12)},
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

const connector = connect(undefined, {loadAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Witness);
