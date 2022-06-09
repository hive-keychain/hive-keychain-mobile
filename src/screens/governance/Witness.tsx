import {loadAccount} from 'actions/hive';
import {ActiveAccount, Witness as WitnessInterface} from 'actions/interfaces';
import keychain from 'api/keychain';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {getClient} from 'utils/hive';
import {translate} from 'utils/localize';
import ProxyUtils from 'utils/proxy';
import WitnessUtils from 'utils/witness';

const MAX_WITNESS_VOTE = 30;

type Props = {
  user: ActiveAccount;
};

const Witness = ({user, loadAccount}: PropsFromRedux & Props) => {
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
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setRemainingVotes(MAX_WITNESS_VOTE - user.account.witnesses_voted_for);

    let proxy = await ProxyUtils.findUserProxy(user.account);

    setUsingProxy(proxy !== null);
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
    setLoading(true);
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
      return;
    }
    if (user.account.witness_votes.includes(witness.name)) {
      try {
        await WitnessUtils.unvoteWitness(witness, user);
        loadAccount(user.name);
        Toast.show(
          translate('governance.witness.success.unvote_wit', {
            name: witness.name,
          }),
        );
      } catch (err) {
        Toast.show(
          translate('governance.witness.error.unvote_wit', {
            name: witness.name,
          }),
        );
      }
    } else {
      try {
        await WitnessUtils.voteWitness(witness, user);
        loadAccount(user.name);
        Toast.show(
          translate('governance.witness.success.unvote_wit', {
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

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1},
});

const mapStateToProps = (state: RootState) => {
  return {};
};
const connector = connect(mapStateToProps, {loadAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Witness);
