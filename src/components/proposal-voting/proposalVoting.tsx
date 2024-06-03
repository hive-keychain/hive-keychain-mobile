import {ExtendedAccount} from '@hiveio/dhive';
import {updateFloatingBar} from 'actions/floatingBar';
import {addTab} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getColors} from 'src/styles/colors';
import {RootState} from 'store';
import {ProposalConfig} from 'utils/config';
import {toHP} from 'utils/format';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import ProposalUtils from 'utils/proposals';

const ProposalVotingSection = ({
  activeAccount,
  isMessageContainerDisplayed,
  globalProperties,
  showModal,
  addTab,
  updateFloatingBar,
  loaded,
}: PropsFromRedux & {loaded: boolean}) => {
  const [hasVoted, sethasVoted] = useState(true);
  const [forceClosed, setForcedClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  useEffect(() => {
    if (loaded && activeAccount.account) {
      initHasVotedForProposal(activeAccount.account);
    }
  }, [activeAccount, loaded]);

  const initHasVotedForProposal = async (account: ExtendedAccount) => {
    if (!account.proxy === undefined) return;
    if (await ProposalUtils.isRequestingProposalVotes(globalProperties!)) {
      // Consider as already voted if it is, or if the account has a proxy or few HP

      const hasVoted =
        (await ProposalUtils.hasVotedForProposal(account.name!)) ||
        !!account.proxy.length ||
        toHP(account.vesting_shares.toString(), globalProperties) < 100;
      sethasVoted(hasVoted);
      updateFloatingBar(
        !(isMessageContainerDisplayed || hasVoted || forceClosed),
      );
    }
  };

  const handleVoteForProposalClicked = async () => {
    setLoading(true);
    const success = await ProposalUtils.voteForKeychainProposal(
      activeAccount.name!,
      activeAccount.keys.active!,
    );
    if (success) {
      showModal('wallet.proposal.vote_success', MessageModalType.SUCCESS);
    } else {
      showModal('wallet.proposal.vote_fail', MessageModalType.ERROR);
    }
    setForcedClosed(true);
    updateFloatingBar(false);
  };

  const handleReadClicked = () => {
    addTab(
      `https://peakd.com/me/proposals/${ProposalConfig.KEYCHAIN_PROPOSAL}`,
    );
    handleClose();
    navigate('BrowserScreen');
  };

  const handleClose = () => {
    setForcedClosed(true);
    updateFloatingBar(false);
  };
  if (isMessageContainerDisplayed || hasVoted || forceClosed) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text style={styles.text}>
            {translate('wallet.proposal.request')}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.close}>
            <Icon
              name={Icons.CLOSE_CIRCLE}
              width={15}
              color={getColors(theme).secondaryTextInverted}
              height={15}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <EllipticButton
            onPress={handleReadClicked}
            title={translate('wallet.proposal.read')}
            style={styles.buttons}
          />
          <ActiveOperationButton
            method={KeyTypes.active}
            onPress={handleVoteForProposalClicked}
            title={translate('wallet.proposal.vote')}
            style={styles.buttons}
            isLoading={loading}
          />
        </View>
      </View>
    );
  }
};

const getStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: getColors(theme).contrastBackground,
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 80,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      rowGap: 8,
      padding: 0,
      margin: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderColor: getColors(theme).cardBorderColor,
      borderBottom: 0,
      zIndex: 400,
    },
    close: {
      marginLeft: 20,
      marginTop: 3,
      color: getColors(theme).secondaryTextInverted,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    buttons: {width: '40%', borderColor: 'transparent', height: 40},
    text: {color: getColors(theme).secondaryTextInverted},
  });
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.activeAccount,
    isMessageContainerDisplayed: state.message.key.length > 0,
    globalProperties: state.properties.globals,
  };
};

const connector = connect(mapStateToProps, {
  addTab,
  showModal,
  updateFloatingBar,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ProposalVotingSectionComponent = connector(ProposalVotingSection);
