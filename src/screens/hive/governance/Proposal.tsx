import {loadAccount} from 'actions/index';
import {ActiveAccount} from 'actions/interfaces';
import ProposalItem from 'components/hive/ProposaItem';
import Loader from 'components/ui/Loader';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';
import ProposalUtils, {Proposal as ProposalInterface} from 'utils/proposals';
import ProxyUtils from 'utils/proxy';

type Props = {
  user: ActiveAccount;
};

const Proposal = ({user, loadAccount}: PropsFromRedux & Props) => {
  const [proposals, setProposals] = useState<ProposalInterface[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [displayingProxyVotes, setDisplayingProxyVotes] = useState(false);
  const styles = getDimensionedStyles(useWindowDimensions());

  useEffect(() => {
    initList();
  }, [user]);

  const initList = async () => {
    if (!proposals.length) setLoading(true);
    let proxy = await ProxyUtils.findUserProxy(user.account);
    if (proxy) {
      setDisplayingProxyVotes(true);
    } else {
      setDisplayingProxyVotes(false);
    }
    const proposalsList = await ProposalUtils.getProposalList(
      proxy ?? user.name!,
    );
    setProposals(proposalsList);
    setLoading(false);
  };

  if (!isLoading)
    return (
      <View style={styles.container}>
        <Text style={[styles.withPadding, styles.text]}>
          The decentralized Hive Fund (DHF) gives funding to project proposals,
          based on community votes.
        </Text>
        {displayingProxyVotes && (
          <Text style={[styles.withPadding, styles.text]}>
            {translate('governance.witness.has_proxy', {
              proxy: user.account.proxy,
            })}
          </Text>
        )}
        <View>
          <FlatList
            data={proposals}
            keyExtractor={(proposal) => proposal.proposalId + ''}
            renderItem={({item: proposal, index}) => (
              <ProposalItem
                user={user}
                style={[
                  styles.withPadding,
                  index % 2 === 0 ? styles.even : undefined,
                ]}
                displayingProxyVotes={displayingProxyVotes}
                key={proposal.proposalId}
                proposal={proposal}
                onVoteUnvoteSuccessful={() => {
                  loadAccount(user.name);
                }}
              />
            )}
          />
        </View>
      </View>
    );
  else
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Loader animating />
      </View>
    );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      marginTop: 30,
    },

    withPadding: {
      paddingHorizontal: 0.05 * width,
    },
    even: {backgroundColor: 'white'},
    text: {fontSize: 16, marginBottom: 20},
  });

const connector = connect(undefined, {
  loadAccount,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Proposal);
