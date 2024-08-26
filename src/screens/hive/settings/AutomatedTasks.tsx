import CheckBoxPanel from 'components/form/CheckBoxPanel';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import UserDropdown from 'components/form/UserDropdown';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import Spoiler from 'components/ui/Spoiler';
import SwapCurrencyImage from 'components/ui/SwapCurrencyImage';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {CARD_PADDING_HORIZONTAL, getCardStyle} from 'src/styles/card';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {ICONMINDIMENSIONS} from 'src/styles/icon';
import {inputStyle} from 'src/styles/input';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import AutomatedTasksUtils from 'utils/automatedTasks.utils';
import {ClaimsConfig} from 'utils/config';
import {translate} from 'utils/localize';

const AutomatedTasks = ({active, tokens}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  const {width} = useWindowDimensions();
  const [claimRewards, setClaimRewards] = useState(false);
  const [claimAccounts, setClaimAccounts] = useState(false);
  const [claimSavings, setClaimSavings] = useState(false);
  const [claimSavingsErrorMessage, setClaimSavingsErrorMessage] = useState<
    string
  >(undefined);
  const [claimAccountErrorMessage, setClaimAccountErrorMessage] = useState<
    string
  >(undefined);
  const [claimRewardsErrorMessage, setClaimRewardsErrorMessage] = useState<
    string
  >(undefined);
  const [enabledAutoStake, setEnabledAutoStake] = useState(false);
  const [autoStakeTokenList, setAutoStakeTokenList] = useState<
    DropdownModalItem[]
  >([]);
  useEffect(() => {
    setClaimAccountErrorMessage(undefined);
    setClaimSavingsErrorMessage(undefined);
    setClaimRewardsErrorMessage(undefined);
    init();
  }, [active]);
  const ref: MutableRefObject<ScrollView> = useRef(null);

  const init = async () => {
    const values = await AutomatedTasksUtils.getClaims(active.name!);
    setClaimRewards(values[KeychainStorageKeyEnum.CLAIM_REWARDS] ?? false);
    setClaimAccounts(values[KeychainStorageKeyEnum.CLAIM_ACCOUNTS] ?? false);
    setClaimSavings(values[KeychainStorageKeyEnum.CLAIM_SAVINGS] ?? false);
    setClaimSavingsErrorMessage(
      AutomatedTasksUtils.canClaimSavingsErrorMessage(active),
    );
    setClaimAccountErrorMessage(
      AutomatedTasksUtils.canClaimAccountErrorMessage(active),
    );
    setClaimRewardsErrorMessage(
      AutomatedTasksUtils.canClaimRewardsErrorMessage(active),
    );
    setEnabledAutoStake(
      await AutomatedTasksUtils.getUserAutoStake(active.name!),
    );
    const previousList = await AutomatedTasksUtils.getUserAutoStakeList(
      active.name!,
      tokens,
    );

    setAutoStakeTokenList(
      previousList.map((token) => {
        token.icon = (
          <SwapCurrencyImage
            uri={(token.icon as unknown) as string}
            symbol={token.value}
            svgHeight={20}
            svgWidth={20}
          />
        );
        return token;
      }),
    );
  };

  const handleSetAutoStake = async (enable: boolean) => {
    setEnabledAutoStake(enable);
    await AutomatedTasksUtils.saveUserAutoStake(active.name!, enable);
  };

  const saveClaims = async (
    claimRewards: boolean,
    claimAccounts: boolean,
    claimSavings: boolean,
  ) => {
    setClaimAccounts(claimAccounts);
    setClaimRewards(claimRewards);
    setClaimSavings(claimSavings);

    await AutomatedTasksUtils.saveClaims(
      claimRewards,
      claimAccounts,
      claimSavings,
      active.name!,
    );
  };

  const setAndSaveAutoStakeTokenList = async (
    autoStakeData: DropdownModalItem[],
  ) => {
    setAutoStakeTokenList(autoStakeData);
    await AutomatedTasksUtils.updateAutoStakeTokenList(
      active.name!,
      autoStakeData,
    );
  };

  const renderItem = (item: DropdownModalItem, index: number) => {
    const innerContainerStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: item.removable ? '100%' : 'auto',
      alignItems: 'center',
      alignContent: 'center',
    } as ViewStyle;
    const innerContainerBgStyle = {
      alignContent: 'space-between',
      flex: 1,
    } as ViewStyle;

    const labelTextStyle = {
      color: 'white',
    } as ViewStyle;

    return (
      <View style={[{paddingVertical: 4}]}>
        <TouchableOpacity activeOpacity={1} style={[styles.tokenItem]}>
          <View style={[innerContainerStyle, innerContainerBgStyle]}>
            <View style={{flexDirection: 'row'}}>
              {item.icon}
              <Text
                style={[
                  inputStyle(theme, width).input,
                  labelTextStyle,
                  {marginLeft: 10},
                ]}>
                {item.label}
              </Text>
            </View>
            <Icon
              theme={theme}
              name={Icons.REMOVE}
              onPress={() => handleRemoveItem(item)}
              color={PRIMARY_RED_COLOR}
            />
          </View>
        </TouchableOpacity>
        {index !== autoStakeTokenList.length - 1 && (
          <Separator
            additionalLineStyle={{
              borderColor: getCardStyle(theme).borderTopCard.borderColor,
            }}
            height={0}
          />
        )}
      </View>
    );
  };

  const handleRemoveItem = async (item: DropdownModalItem) => {
    if (autoStakeTokenList.find((a) => a.value === item.value)) {
      const copyAutoStakeList = [...autoStakeTokenList].filter(
        (i) => i.value !== item.value,
      );
      await setAndSaveAutoStakeTokenList(copyAutoStakeList);
    }
  };

  return (
    <Background theme={theme}>
      <ScrollView style={styles.container} ref={ref}>
        <Caption
          text={'settings.settings.automated_tasks.disclaimer'}
          hideSeparator
        />
        <FocusAwareStatusBar />
        <UserDropdown />
        <Separator />
        <Spoiler initiallyOpened title="HIVE">
          <>
            <CheckBoxPanel
              checked={claimRewards}
              onPress={
                claimRewardsErrorMessage
                  ? () =>
                      Toast.show(
                        translate(claimRewardsErrorMessage),
                        Toast.LONG,
                      )
                  : () => saveClaims(!claimRewards, claimAccounts, claimSavings)
              }
              containerStyle={{flexGrow: undefined}}
              title="wallet.claim.enable_autoclaim_rewards"
              subTitle="wallet.claim.enable_autoclaim_rewards_info"
            />
            <CheckBoxPanel
              checked={claimAccounts}
              onPress={
                claimAccountErrorMessage
                  ? () =>
                      Toast.show(
                        translate(claimAccountErrorMessage),
                        Toast.LONG,
                      )
                  : () => saveClaims(claimRewards, !claimAccounts, claimSavings)
              }
              title="wallet.claim.enable_autoclaim_accounts"
              containerStyle={{flexGrow: undefined}}
              subTitle={translate(
                'wallet.claim.enable_autoclaim_accounts_info',
                {
                  MIN_RC_PCT: ClaimsConfig.freeAccount.MIN_RC_PCT,
                },
              )}
              skipSubtitleTranslation
            />
            <CheckBoxPanel
              checked={claimSavings}
              containerStyle={{flexGrow: undefined}}
              onPress={
                claimSavingsErrorMessage
                  ? () =>
                      Toast.show(
                        translate(claimSavingsErrorMessage),
                        Toast.LONG,
                      )
                  : () => saveClaims(claimRewards, claimAccounts, !claimSavings)
              }
              title="wallet.claim.enable_autoclaim_savings"
              subTitle="wallet.claim.enable_autoclaim_savings_info"
            />
          </>
        </Spoiler>
        <Separator />
        <Spoiler title="Hive Engine">
          <>
            <CheckBoxPanel
              title="settings.settings.automated_tasks.he_auto.title"
              checked={enabledAutoStake}
              onPress={() => {
                handleSetAutoStake(!enabledAutoStake);
              }}
              subTitle="settings.settings.automated_tasks.he_auto.subtitle"
            />
            {enabledAutoStake && (
              <View>
                <View>
                  <DropdownModal
                    enableSearch
                    dropdownTitle="common.token"
                    dropdownIconScaledSize={ICONMINDIMENSIONS}
                    additionalDropdowContainerStyle={{paddingHorizontal: 8}}
                    selected={
                      {
                        value: undefined,
                        label: 'Select a token',
                        icon: null,
                      } as DropdownModalItem
                    }
                    onSelected={(item) => {
                      if (
                        !autoStakeTokenList?.find((a) => a.value === item.value)
                      ) {
                        const copyAutoStakeList = [...autoStakeTokenList];
                        copyAutoStakeList.unshift(item);
                        setAndSaveAutoStakeTokenList(copyAutoStakeList);
                        ref.current.scrollToEnd();
                      }
                    }}
                    list={tokens
                      .filter(
                        (token) =>
                          token.stakingEnabled &&
                          !autoStakeTokenList.find(
                            (e) => e.value === token.symbol,
                          ),
                      )
                      .map((token) => {
                        return {
                          value: token.symbol,
                          label: token.symbol,
                          icon: (
                            <SwapCurrencyImage
                              uri={token.metadata.icon}
                              symbol={token.symbol}
                              svgHeight={20}
                              svgWidth={20}
                            />
                          ),
                        } as DropdownModalItem;
                      })}
                    drawLineBellowSelectedItem
                    showSelectedIcon={
                      <Icon
                        name={Icons.CHECK}
                        theme={theme}
                        width={18}
                        height={18}
                        strokeWidth={2}
                        color={PRIMARY_RED_COLOR}
                      />
                    }
                    additionalLineStyle={styles.bottomLineDropdownItem}
                  />
                </View>
                <Separator />
                {autoStakeTokenList.length > 0 && enabledAutoStake && (
                  <>
                    <Text
                      style={[
                        inputStyle(theme, width).label,
                        {marginLeft: 10},
                      ]}>
                      {translate(
                        'settings.settings.automated_tasks.he_auto.list_title',
                      )}
                    </Text>
                    <View style={getCardStyle(theme).defaultCardItem}>
                      {/* className="auto-stake-token-list"> */}
                      <FlatList
                        keyboardDismissMode="none"
                        keyboardShouldPersistTaps="handled"
                        data={autoStakeTokenList}
                        keyExtractor={(item) => item.label}
                        renderItem={(item) => renderItem(item.item, item.index)}
                      />
                    </View>
                  </>
                )}
              </View>
            )}
          </>
        </Spoiler>
        <Separator />
      </ScrollView>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1, padding: CARD_PADDING_HORIZONTAL},
    title: {
      ...title_primary_title_1,
      color: getColors(theme).primaryText,
    },
    bottomLineDropdownItem: {
      borderWidth: 1,
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      alignSelf: 'center',
    },
    tokenItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
      marginTop: 6,
    },
  });

const mapStateToProps = (state: RootState) => ({
  active: state.activeAccount,
  tokens: state.tokens,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AutomatedTasks);
