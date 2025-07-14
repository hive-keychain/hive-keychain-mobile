import {loadAccount} from 'actions/index';
import ProposalItem from 'components/hive/ProposalItem';
import {Caption} from 'components/ui/Caption';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {AsyncUtils} from 'utils/async.utils';
import ProposalUtils, {Proposal as ProposalInterface} from 'utils/proposals';
import ProxyUtils from 'utils/proxy';

type Props = {
  isMultisig: boolean;
  twoFABots: {[botName: string]: string};
};

const Proposal = ({
  user,
  loadAccount,
  isMultisig,
  twoFABots,
}: PropsFromRedux & Props) => {
  const [proposals, setProposals] = useState<ProposalInterface[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [displayingProxyVotes, setDisplayingProxyVotes] = useState(false);
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles(width, height, theme);

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

  const handleVoteUnvote = async () => {
    await AsyncUtils.waitForXSeconds(3);
    loadAccount(user.name);
  };

  if (!isLoading)
    return (
      <View style={styles.container}>
        {displayingProxyVotes && (
          <Caption
            text="governance.witness.has_proxy"
            textParams={{proxy: user.account.proxy}}
            hideSeparator
          />
        )}
        <View>
          <Separator />
          <FlatList
            data={proposals}
            keyExtractor={(proposal) => proposal.proposalId + ''}
            renderItem={({item: proposal, index}) => (
              <ProposalItem
                user={user}
                style={[
                  getCardStyle(theme).defaultCardItem,
                  styles.proposalItemContainer,
                ]}
                displayingProxyVotes={displayingProxyVotes}
                key={proposal.proposalId}
                proposal={proposal}
                onVoteUnvoteSuccessful={handleVoteUnvote}
                theme={theme}
                isMultisig={isMultisig}
                twoFABots={twoFABots}
              />
            )}
            ListFooterComponent={() => {
              return <Separator height={20} />;
            }}
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

const getDimensionedStyles = (width: number, height: number, theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      marginHorizontal: 16,
    },
    proposalItemContainer: {
      marginBottom: 10,
      borderRadius: 38,
    },
    text: {
      ...button_link_primary_medium,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 16),
      marginBottom: 20,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
  };
};

const connector = connect(mapStateToProps, {
  loadAccount,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Proposal);
