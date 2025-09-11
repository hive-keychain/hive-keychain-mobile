import AsyncStorage from '@react-native-async-storage/async-storage';
import {addTab} from 'actions/browser';
import {updateShowProposalReminder} from 'actions/floatingBar';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
import {BrowserScreenProps} from 'navigators/mainDrawerStacks/Browser.types';
import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {RootState} from 'store';
import {ProposalConfig} from 'utils/config.utils';
import {toHP} from 'utils/format.utils';
import {getClient, updateProposalVote} from 'utils/hiveLibs.utils';
import {goBack, navigate} from 'utils/navigation.utils';
interface Props {
  navigation: BrowserScreenProps['navigation'];
}

const KEYCHAIN_PROPOSAL = ProposalConfig.KEYCHAIN_PROPOSAL;
const IMAGE_URI =
  'https://images.hive.blog/0x0/https://files.peakd.com/file/peakd-hive/stoodkev/23wXG62TYT2yVFnmLB3hwg9hsL9jmEHYow667J1bVk1ebowRwEnNu3ckaHxHohcatE5v8.png';

const hasVotedForProposal = async (
  username: string,
  proposalId?: number,
): Promise<boolean> => {
  const listProposalVotes = await getClient().call(
    'condenser_api',
    'list_proposal_votes',
    [[proposalId, username], 1, 'by_proposal_voter', 'ascending', 'all'],
  );
  return listProposalVotes[0].voter === username;
};
const getNotifiedVoters = async (): Promise<string[]> => {
  // await AsyncStorage.removeItem(KeychainStorageKeyEnum.PROPOSAL_NOTIFIED);
  const voters = JSON.parse(
    (await AsyncStorage.getItem(KeychainStorageKeyEnum.PROPOSAL_NOTIFIED)) ||
      '[]',
  );
  try {
    if (!Array.isArray(voters)) return [];
    return voters;
  } catch (e) {
    return [];
  }
};

const addNotifiedVoter = async (name: string) => {
  const array = await getNotifiedVoters();
  array.push(name);
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.PROPOSAL_NOTIFIED,
    JSON.stringify(array),
  );
};

const ProposalReminder = ({
  navigation,
  user,
  globalProps,
  addTab,
  updateFloatingBar,
}: Props & PropsFromRedux): null => {
  const {theme} = useThemeContext();

  useEffect(() => {
    checkIfShouldNotify();
  }, [user]);
  const styles = getStyles(theme);
  const checkIfShouldNotify = async () => {
    const notified = await getNotifiedVoters();
    if (
      !notified.includes(user.name) &&
      !user.account?.proxy?.length &&
      toHP(user.account.vesting_shares.toString(), globalProps) > 100 &&
      !(await hasVotedForProposal(user.name, KEYCHAIN_PROPOSAL))
    ) {
      updateFloatingBar(true);
      Image.prefetch(IMAGE_URI).then((val) => {
        navigate('ModalScreen', {
          name: 'ProposalPopup',
          modalContent: renderContent(),
          modalContainerStyle: getModalBaseStyle(theme).roundedTop,
          onForceCloseModal: () => {},
        });
      });
    }
  };

  const renderContent = () => {
    return (
      <ScrollView aria-label="whats-new-component" style={styles.rootContainer}>
        <Text style={styles.title}>Support Keychain Development!</Text>
        <Image
          style={styles.image}
          source={{
            uri: IMAGE_URI,
          }}
        />
        <Text style={styles.text}>
          Hive Keychain is developed thanks to our community support through the
          Decentralized Hive Fund.
        </Text>
        <Text style={styles.text}>
          We need your help to continue our work on Hive Keychain Apps and
          extensions. Please consider supporting our DHF proposal with your
          vote.
        </Text>
        <Text style={styles.text}>
          Read more{' '}
          <Text
            style={{
              color: getColors(theme).secondaryText,
              fontWeight: 'bold',
            }}
            onPress={() => {
              addTab(`https://peakd.com/proposals/${KEYCHAIN_PROPOSAL}`);
              navigate('Browser');
            }}>
            here
          </Text>
          .
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',

              width: 100,
            }}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
                fontWeight: 'bold',
                color: getColors(theme).secondaryText,
                textDecorationColor: getColors(theme).secondaryText,
                textDecorationLine: 'underline',
              }}
              onPress={() => {
                addNotifiedVoter(user.name);
                goBack();
                updateFloatingBar(false);
              }}>
              I won't support
            </Text>
          </View>
          <EllipticButton
            style={{width: 170}}
            title="Vote for Proposal"
            onPress={() => {
              addNotifiedVoter(user.name);
              updateProposalVote(user.keys.active, {
                voter: user.name,
                proposal_ids: [KEYCHAIN_PROPOSAL],
                approve: true,
                extensions: [],
              }).then(() => {
                SimpleToast.show('Thanks for your support!');
                updateFloatingBar(false);
                goBack();
              });
            }}
          />
        </View>
        <Separator height={initialWindowMetrics.insets.bottom + 20} />
      </ScrollView>
    );
  };
  return null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    rootContainer: {
      width: '100%',
      padding: 12,
      paddingBottom: initialWindowMetrics.insets.bottom + 20,
    },
    title: {
      textAlign: 'center',
      color: getColors(theme).secondaryText,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
      marginBottom: 10,
      color: getColors(theme).secondaryText,
    },
    image: {
      marginBottom: 30,
      aspectRatio: 1.6,
      alignSelf: 'center',
      width: '100%',
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    globalProps: state.properties.globals,
  };
};

const connector = connect(mapStateToProps, {
  addTab,
  updateFloatingBar: updateShowProposalReminder,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ProposalReminder);
