import {Witness as WitnessInterface} from 'actions/interfaces';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import WalletPage from 'components/ui/WalletPage';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {
  button_link_primary_medium,
  fields_primary_text_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {getOrdinalLabelTranslation} from 'utils/format';
import {translate} from 'utils/localize';
import {getWitnessInfo} from 'utils/witness.utils';
import EditMyWitness from './EditMyWitness';
import MyWitnessInformation from './MyWitnessInformation';
import MyWitnessInformationParams from './MyWitnessInformationParams';
interface Props {
  theme: Theme;
  ranking: WitnessInterface;
}

const MyWitness = ({
  theme,
  user,
  ranking,
  globalProperties,
  currencyPrices,
}: Props & PropsFromRedux) => {
  const [displayInfo, setDisplayInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [witnessInfo, setWitnessInfo] = useState<any>();
  const [hasError, setHasError] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const result = await getWitnessInfo(
        user.name!,
        globalProperties,
        currencyPrices,
      );
      setWitnessInfo(result);
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(theme);

  const shadowActiveSwitch = generateBoxShadowStyle(
    0,
    13,
    RED_SHADOW_COLOR,
    1,
    25,
    30,
    RED_SHADOW_COLOR,
  );

  const getActiveSwitchStyle = (active: boolean) => {
    return active
      ? {...styles.switchActive, ...shadowActiveSwitch}
      : styles.switchInactive;
  };

  if (isLoading && !hasError) {
    return (
      <View
        style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <Loader animating size={'large'} />
      </View>
    );
  } else if (!isLoading && hasError) {
    return (
      <View style={{}}>
        <Text style={[styles.textTitle]}>
          {translate('governance.witness.error.retrieving_witness_info')}
        </Text>
      </View>
    );
  } else {
    return (
      <WalletPage>
        <View style={[styles.myWitnessContainer]}>
          {!editMode && (
            <View style={styles.witnessInfoContainer}>
              <TouchableOpacity
                style={[getCardStyle(theme).defaultCardItem, styles.switch]}
                onPress={() => setDisplayInfo(!displayInfo)}>
                <View style={styles.switcherContainer}>
                  <Text
                    style={[
                      styles.smallText,
                      getActiveSwitchStyle(displayInfo),
                    ]}>
                    {translate('governance.my_witness.info')}
                  </Text>
                  <Text
                    style={[
                      styles.smallText,
                      getActiveSwitchStyle(!displayInfo),
                    ]}>
                    {translate('governance.my_witness.param')}
                  </Text>
                </View>
              </TouchableOpacity>
              <Separator height={8} />
              <View style={styles.userInfoCard}>
                <UserProfilePicture
                  username={user.name!}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.usernameText}>@{user.name!}</Text>
                  <Text style={[styles.smallText]}>
                    {ranking.active_rank}
                    {translate(
                      getOrdinalLabelTranslation(ranking.active_rank),
                    )}{' '}
                    {translate('governance.my_witness.rank')}
                  </Text>
                </View>
              </View>
              <Separator />
              {displayInfo ? (
                <MyWitnessInformation theme={theme} witnessInfo={witnessInfo} />
              ) : (
                <MyWitnessInformationParams
                  theme={theme}
                  witnessInfo={witnessInfo}
                  setEditMode={() => setEditMode(true)}
                />
              )}
            </View>
          )}
          {editMode && (
            <EditMyWitness
              theme={theme}
              witnessInfo={witnessInfo}
              setEditMode={setEditMode}
            />
          )}
        </View>
      </WalletPage>
    );
  }
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    myWitnessContainer: {
      padding: 16,
      flexGrow: 1,
    },
    witnessInfoContainer: {flexGrow: 1},
    textTitle: {
      lineHeight: 16,
      textAlignVertical: 'center',
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
    },
    userInfoCard: {
      flexDirection: 'row',
      ...(getCardStyle(theme).defaultCardItem as any),
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 50,
      marginRight: 8,
    },
    switch: {
      width: 116,
      alignSelf: 'flex-end',
      borderRadius: 26,
      paddingVertical: 2,
      paddingHorizontal: 4,
    },
    switcherContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    smallText: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_2,
    },
    usernameText: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
    switchActive: {
      borderRadius: 26,
      borderWidth: 1,
      width: 50,
      height: '100%',
      backgroundColor: PRIMARY_RED_COLOR,
      borderColor: '#00000000',
      color: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      textAlignVertical: 'center',
      padding: 4,
    },
    switchInactive: {
      padding: 4,
      width: 50,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
    globalProperties: state.properties,
    currencyPrices: state.currencyPrices,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(MyWitness);
