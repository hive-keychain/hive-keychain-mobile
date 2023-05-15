import AsyncStorage from '@react-native-community/async-storage';
import EllipticButton from 'components/form/EllipticButton';
import {BrowserNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect} from 'react';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {RootState} from 'store';
import {toHP} from 'utils/format';
import {getClient, updateProposalVote} from 'utils/hive';
import {navigate} from 'utils/navigation';

interface Props {
  navigation: BrowserNavigation;
}

const KEYCHAIN_PROPOSAL = 262;
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
  console.log('p', listProposalVotes[0].voter === username);
  return listProposalVotes[0].voter === username;
};
const getNotifiedVoters = async (): Promise<string[]> => {
  return JSON.parse(
    (await AsyncStorage.getItem(KeychainStorageKeyEnum.PROPOSAL_NOTIFIED)) ||
      '[]',
  );
};

AsyncStorage.removeItem(KeychainStorageKeyEnum.PROPOSAL_NOTIFIED);

const addNotifiedVoter = async (name: string) => {
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.PROPOSAL_NOTIFIED,
    JSON.stringify((await getNotifiedVoters()).push(name)),
  );
};

const ProposalReminder = ({
  navigation,
  user,
  globalProps,
}: Props & PropsFromRedux): null => {
  useEffect(() => {
    checkIfShouldNotify();
  }, [user]);

  const checkIfShouldNotify = async () => {
    const NOTIFIED = await getNotifiedVoters();

    if (
      !NOTIFIED.includes(user.name) &&
      !user.account.proxy.length &&
      toHP(user.account.vesting_shares.toString(), globalProps) > 100 &&
      !(await hasVotedForProposal(user.name, KEYCHAIN_PROPOSAL))
    )
      Image.prefetch(IMAGE_URI).then((val) => {
        navigate('ModalScreen', {
          name: 'Whats_new_popup',
          modalContent: renderContent(),
          onForceCloseModal: () => {},
        });
      });
  };

  const renderContent = () => {
    return (
      <View aria-label="whats-new-component" style={styles.rootContainer}>
        <Text style={styles.title}>Support Keychain Development!</Text>
        <Image
          style={styles.image}
          source={{
            uri: IMAGE_URI,
          }}
        />
        <Text style={styles.text}>
          We need your help to continue our work on Hive Keychain Apps and
          extensions. Please consider supporting our DHF proposal.
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 40,
          }}>
          <EllipticButton
            title="Read"
            style={{width: 100}}
            onPress={() => {
              addNotifiedVoter(user.name);
              navigation.navigate('BrowserScreen');
              Linking.openURL(
                `https://peakd.com/proposals/${KEYCHAIN_PROPOSAL}`,
              );
            }}></EllipticButton>
          <EllipticButton
            style={{width: 150}}
            title="Support"
            onPress={() => {
              addNotifiedVoter(user.name);
              updateProposalVote(user.keys.active, {
                voter: user.name,
                proposal_ids: [KEYCHAIN_PROPOSAL],
                approve: true,
                extensions: [],
              }).then(() => {
                SimpleToast.show('Thanks for your support!');
                navigation.navigate('BrowserScreen');
              });
            }}
          />
        </View>
      </View>
    );
  };
  return null;
};

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
  },
  title: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {fontSize: 16},
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

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ProposalReminder);
