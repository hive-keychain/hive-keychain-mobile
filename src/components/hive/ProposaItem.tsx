import {ActiveAccount} from 'actions/interfaces';
import Vote from 'assets/governance/arrow_circle_up.svg';
import Money from 'assets/governance/attach_money.svg';
import ExpandLess from 'assets/governance/expand_less.svg';
import ExpandMore from 'assets/governance/expand_more.svg';
import Timelapse from 'assets/governance/timelapse.svg';
import moment from 'moment';
import React, {useState} from 'react';
import {
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {withCommas} from 'utils/format';
import {updateProposalVote} from 'utils/hive';
import {translate} from 'utils/localize';
import {Proposal} from 'utils/proposals';

interface ProposalItemProps {
  user: ActiveAccount;
  proposal: Proposal;
  displayingProxyVotes: boolean;
  onVoteUnvoteSuccessful: () => void;
  style: StyleProp<ViewStyle>;
}

const ProposalItem = ({
  proposal,
  user,
  onVoteUnvoteSuccessful,
  displayingProxyVotes,
  style,
}: ProposalItemProps) => {
  const [isExpandablePanelOpened, setExpandablePanelOpened] = useState(false);

  const goTo = (link: Proposal['link']) => {
    Linking.openURL(link);
  };

  const goToCreator = (creator: Proposal['creator']) => {
    Linking.openURL(`https://peakd.com/@${creator}`);
  };

  const toggleSupport = async (proposal: Proposal) => {
    if (!user.keys.active) {
      Toast.show(translate('governance.proposal.error.active'));
      return;
    }
    if (displayingProxyVotes) {
      Toast.show(translate('governance.proposal.error.using_proxy'));
      return;
    }
    if (proposal.voted) {
      if (
        await updateProposalVote(user.keys.active, {
          voter: user.name,
          proposal_ids: [proposal.proposalId],
          approve: false,
          extensions: [],
        })
      ) {
        onVoteUnvoteSuccessful();
        Toast.show(translate('governance.proposal.success.unvote'));
      } else {
        Toast.show(translate('governance.proposal.error.unvote'));
      }
    } else {
      if (
        await updateProposalVote(user.keys.active, {
          voter: user.name,
          proposal_ids: [proposal.proposalId],
          approve: true,
          extensions: [],
        })
      ) {
        Toast.show(translate('governance.proposal.success.vote'));
        onVoteUnvoteSuccessful();
      } else {
        Toast.show(translate('governance.proposal.error.vote'));
      }
    }
  };

  return (
    <TouchableOpacity
      style={[style, styles.container]}
      onPressOut={() => {
        setExpandablePanelOpened(!isExpandablePanelOpened);
        console.log('toggle');
      }}>
      <View style={styles.firstLine}>
        <View style={styles.title}>
          <Text
            onLongPress={() => goTo(proposal.link)}
            style={{fontWeight: '500'}}>
            #{proposal.id} - {proposal.subject}
          </Text>
        </View>
        <View style={styles.expander}>
          {isExpandablePanelOpened ? <ExpandLess /> : <ExpandMore />}
        </View>
      </View>
      <View style={styles.secondLine}>
        <View style={styles.user}>
          <TouchableOpacity onLongPress={() => goToCreator(proposal.creator)}>
            <FastImage
              source={{
                uri: `https://images.hive.blog/u/${proposal.creator}/avatar`,
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text
            onLongPress={() => goToCreator(proposal.creator)}
            style={styles.username}>
            {translate('governance.proposal.by', {name: proposal.creator})}
          </Text>
        </View>
        <View>
          <Vote
            fill={proposal.voted ? 'black' : 'lightgrey'}
            onPressIn={(e) => {
              console.log('vote');
              e.stopPropagation();
              e.preventDefault();
              toggleSupport(proposal);
            }}
          />
        </View>
      </View>
      {isExpandablePanelOpened && (
        <View style={styles.expanded}>
          <View>
            <View style={styles.detail}>
              <Vote style={styles.detailIcon} fill="black" height={18} />
              <Text style={styles.detailText}>{proposal.totalVotes}</Text>
            </View>
            <View style={styles.detail}>
              <Timelapse style={styles.detailIcon} height={18} />
              <Text style={styles.detailText}>
                {translate('governance.proposal.remaining', {
                  days: withCommas(
                    proposal.endDate
                      .diff(moment(new Date()), 'days')
                      .toString(),
                    0,
                  ),
                })}
              </Text>
            </View>
            <View style={styles.detail}>
              <Money style={styles.detailIcon} height={18} />
              <Text style={styles.detailText}>
                {withCommas(proposal.dailyPay)}/
                {translate('governance.proposal.day')}
              </Text>
            </View>
          </View>
          <View style={styles.status}>
            <Text>{translate(`governance.proposal.${proposal.funded}`)}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {paddingVertical: 10},
  firstLine: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  title: {width: '90%', fontWeight: 'bold'},
  expander: {},
  secondLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  user: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  avatar: {width: 30, height: 30, borderRadius: 15, marginRight: 10},
  expanded: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {flexDirection: 'row', marginTop: 5},
  detailIcon: {marginRight: 10},
  detailText: {fontSize: 14},
  status: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  username: {textAlignVertical: 'center'},
});

export default ProposalItem;
