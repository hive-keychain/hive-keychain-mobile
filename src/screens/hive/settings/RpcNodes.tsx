import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadUserTokens} from 'actions/hiveEngine';
import {Rpc} from 'actions/interfaces';
import {setAccountHistoryRpc, setHiveEngineRpc, setRpc} from 'actions/settings';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import CheckBox from 'components/form/CustomCheckBox';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {
  DEFAULT_ACCOUNT_HISTORY_RPCS,
  DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
  DEFAULT_CUSTOM_RPC,
  DEFAULT_HE_RPC_NODE,
  DEFAULT_HIVE_ENGINE_RPCS,
} from 'src/interfaces/hiveEngineRpc.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  DROPDOWN_CONTENT_MAX_HEIGHT,
  LABEL_INDENT_SPACE,
  MARGIN_LEFT_RIGHT_MIN,
  MARGIN_PADDING,
} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_3,
} from 'src/styles/typography';
import {RootState} from 'store';
import {DEFAULT_RPC, rpcList} from 'utils/hive.utils';
import {HiveEngineConfigUtils} from 'utils/hiveEngineConfig.utils';
import {translate} from 'utils/localize';
import {addCustomRpc, deleteCustomRpc, getCustomRpcs} from 'utils/rpc.utils';
import * as ValidUrl from 'valid-url';
import RpcComponent from './RpcComponent';

const RpcNodes = ({
  settings,
  rpc,
  setHiveEngineRpc,
  setAccountHistoryRpc,
  activeHiveEngineRpc,
  activeAccountHistoryAPIRpc,
  setRpc,
  loadUserTokens,
  active,
}: PropsFromRedux) => {
  //Hive RPC
  const [showAddCustomRPC, setShowAddCustomRPC] = useState(false);
  const [customRPCSetActive, setCustomRPCSetActive] = useState<boolean>(false);
  const [customRPC, setCustomRPC] = useState<Rpc>(DEFAULT_CUSTOM_RPC);
  const [switchRPCAuto, setSwitchRPCAuto] = useState(false);
  const [rpcFullList, setRpcFullList] = useState<DropdownModalItem[]>([]);
  const [customRPCList, setCustomRPCList] = useState<Rpc[]>([]);
  const [switchHiveEngineRPCAuto, setSwitchHiveEngineRPCAuto] = useState(false);

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);

  useEffect(() => {
    init();
    initSwitchAuto();
  }, []);

  const initSwitchAuto = async () => {
    const storageItems = await AsyncStorage.multiGet([
      KeychainStorageKeyEnum.SWITCH_RPC_AUTO,
      KeychainStorageKeyEnum.SWITCH_HE_RPC_AUTO,
    ]);
    setSwitchRPCAuto(
      storageItems[0][1] === 'true' || storageItems[0][1] === null,
    );
    setSwitchHiveEngineRPCAuto(
      storageItems[1][1] === 'true' ||
        (storageItems[1][1] === null &&
          activeHiveEngineRpc === DEFAULT_HE_RPC_NODE),
    );
  };

  const cleanRpcLabel = (label: string) =>
    label.replace('http://', '').replace('https://', '').split('/')[0];

  const getDropdownItem = (
    item: string,
    cleanLabel?: boolean,
    removable?: boolean,
  ) => {
    const label = cleanLabel ? cleanRpcLabel(item) : item;
    return {
      value: item,
      label: label,
      removable: removable,
    } as DropdownModalItem;
  };

  const init = async () => {
    const customRPCs = await getCustomRpcs();
    setCustomRPCList(customRPCs);
    const finalDropdownRpcList = [
      ...rpcList.map((item) => getDropdownItem(item.uri, true, false)),
      ...customRPCs.map((item) => getDropdownItem(item.uri, true, true)),
    ];
    setRpcFullList(finalDropdownRpcList);

    //Init Hive Engine RPCs
    let tempHiveEngineRpc = [...DEFAULT_HIVE_ENGINE_RPCS];
    const customHERpcList = await HiveEngineConfigUtils.getCustomRpcs();
    const finalDropdownHERpcList = [
      ...tempHiveEngineRpc.map((item) => getDropdownItem(item, true, false)),
      ...customHERpcList.map((item) => getDropdownItem(item, true, true)),
    ];
    setHiveEngineRPCList(finalDropdownHERpcList);

    //Init Account History API
    const tempAccountHistoryAPI = [...DEFAULT_ACCOUNT_HISTORY_RPCS];
    const customAccountHistoryAPIList =
      await HiveEngineConfigUtils.getCustomAccountHistoryApi();
    const finalDropdownAccountHistoryList = [
      ...tempAccountHistoryAPI.map((item) =>
        getDropdownItem(item, true, false),
      ),
      ...customAccountHistoryAPIList.map((item) =>
        getDropdownItem(item, true, true),
      ),
    ];
    setAccountHistoryAPIList(finalDropdownAccountHistoryList);
  };

  const handleSetCustomRPC = (value: string | boolean, key: keyof Rpc) => {
    setCustomRPC((prevState) => {
      return {...prevState, [key]: value};
    });
  };

  const handleAddCustomRPC = async () => {
    if (ValidUrl.isWebUri(customRPC.uri)) {
      if (!rpcFullList.find((rpcLoaded) => rpcLoaded.value === customRPC.uri)) {
        await addCustomRpc(customRPC);
        const newList = [...rpcFullList];
        newList.push({value: customRPC.uri, removable: true});
        setRpcFullList(newList);
        if (customRPCSetActive) {
          setRpc(customRPC);
        }
        setCustomRPCSetActive(false);
        setShowAddCustomRPC(false);
        setCustomRPC(DEFAULT_CUSTOM_RPC);
        init();
        SimpleToast.show(translate('toast.rpc_node_added_success'), {
          duration: SimpleToast.durations.LONG,
        });
      } else {
        SimpleToast.show(
          translate('settings.settings.rpc_node_already_exists'),
          {
            duration: SimpleToast.durations.LONG,
          },
        );
      }
    } else {
      SimpleToast.show(translate('common.invalid_url'), {
        duration: SimpleToast.durations.LONG,
      });
    }
  };

  const handleOnRemoveCustomRPC = async (uri: string) => {
    if (rpc.uri === uri) {
      onHandleSetRPC(DEFAULT_RPC.uri);
    }
    await deleteCustomRpc(customRPCList, {uri});
    const updatedFullList = [...rpcFullList];
    setRpcFullList(updatedFullList.filter((removed) => removed.value !== uri));
  };

  const onHandleSetRPC = (item: string) => {
    setRpc({uri: item} as Rpc);
  };

  const getItemDropDownSelected = (rpcItem: Rpc): DropdownModalItem => {
    return {
      label: cleanRpcLabel(rpcItem.uri),
      value: rpcItem.uri,
    };
  };

  const renderRpcItem = () => {
    return (
      <View
        style={{
          width: '100%',
        }}>
        <View style={[styles.rpcItemContainer]}>
          <DropdownModal
            dropdownTitle="settings.settings.hive_rpc"
            hideLabel
            list={rpcFullList}
            selected={getItemDropDownSelected(rpc)}
            onSelected={(selected) => onHandleSetRPC(selected.value)}
            onRemove={(item) => handleOnRemoveCustomRPC(item)}
            additionalDropdowContainerStyle={[styles.dropdown]}
            dropdownIconScaledSize={styles.dropdownIconDimensions}
            additionalOverlayStyle={{
              paddingHorizontal: MARGIN_PADDING,
            }}
            drawLineBellowSelectedItem
            additionalListExpandedContainerStyle={styles.dropdown}
            showSelectedIcon
            additionalLineStyle={styles.bottomLineDropdownItem}
          />
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[getCardStyle(theme).defaultCardItem, styles.addButton]}
              onPress={() => setShowAddCustomRPC(!showAddCustomRPC)}>
              <Text style={styles.text}>{showAddCustomRPC ? 'x' : '+'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {showAddCustomRPC && renderAddCustomRPC()}
      </View>
    );
  };

  const renderAddCustomRPC = () => {
    return (
      <View style={[getCardStyle(theme).defaultCardItem]}>
        <View style={styles.flexRow}>
          <Text style={styles.text}>
            {translate('settings.settings.add_rpc_title')}
          </Text>
          <Icon
            theme={theme}
            name={Icons.RAM}
            onPress={handleAddCustomRPC}
            color={PRIMARY_RED_COLOR}
          />
        </View>
        <Separator
          drawLine
          height={0.5}
          additionalLineStyle={styles.bottomLine}
        />
        <OperationInput
          placeholder={translate('settings.settings.rpc_node')}
          value={customRPC.uri}
          onChangeText={(value) => handleSetCustomRPC(value, 'uri')}
        />
        <Separator />
        <CheckBox
          checked={customRPC.testnet}
          onPress={() => handleSetCustomRPC(!customRPC.testnet, 'testnet')}
          title={'settings.settings.testnet'}
          smallText
        />

        <CheckBox
          checked={customRPCSetActive}
          onPress={() => setCustomRPCSetActive(!customRPCSetActive)}
          title={'settings.settings.set_as_active'}
          smallText
        />
      </View>
    );
  };

  //HIVE Engine RPC
  const [hiveEngineRPCList, setHiveEngineRPCList] = useState<
    DropdownModalItem[]
  >([]);
  const [newHERpc, setNewHERpc] = useState('');
  const [addNewHERpc, setAddNewHERpc] = useState(false);
  const [newHERPCAsActive, setNewHERPCAsActive] = useState(false);
  const onHandleAddCustomHERpc = async () => {
    if (newHERpc.trim().length > 0) {
      if (ValidUrl.isWebUri(newHERpc)) {
        if (!hiveEngineRPCList.find((item) => item.value === newHERpc)) {
          await HiveEngineConfigUtils.addCustomRpc(newHERpc);
          if (newHERPCAsActive) {
            setHiveEngineRpc(newHERpc);
            HiveEngineConfigUtils.setActiveApi(newHERpc);
          }
          setNewHERpc('');
          setAddNewHERpc(false);
          setNewHERPCAsActive(false);
          SimpleToast.show(translate('toast.rpc_node_added_success'), {
            duration: SimpleToast.durations.LONG,
          });
          init();
        } else {
          SimpleToast.show(
            translate('settings.settings.rpc_node_already_exists'),
            {
              duration: SimpleToast.durations.LONG,
            },
          );
        }
      } else {
        SimpleToast.show(translate('common.invalid_url'), {
          duration: SimpleToast.durations.LONG,
        });
      }
    }
  };

  const onHandleRemoveCustomHERpc = async (item: string) => {
    if (HiveEngineConfigUtils.getApi() === item) {
      setHiveEngineRpc(DEFAULT_HE_RPC_NODE);
      HiveEngineConfigUtils.setActiveApi(DEFAULT_HE_RPC_NODE);
    }
    await HiveEngineConfigUtils.deleteCustomRpc(item);
    SimpleToast.show(translate('toast.rpc_node_removed_success'), {
      duration: SimpleToast.durations.LONG,
    });
    init();
  };

  const onHandleSelectHERpc = (item: string) => {
    setHiveEngineRpc(item);
    HiveEngineConfigUtils.setActiveApi(item);
    loadUserTokens(active.account.name);
    init();
  };

  //Account History API
  const [accountHistoryAPIList, setAccountHistoryAPIList] = useState<
    DropdownModalItem[]
  >([]);
  const [newAccountHistoryAPIRpc, setNewAccountHistoryAPIRpc] = useState('');
  const [addNewAccountHistoryAPI, setAddNewAccountHistoryAPI] = useState(false);
  const [newAccountHistoryAPIAsActive, setNewAccountHistoryAPIAsActive] =
    useState(false);

  const onHandleAddCustomAccountHistoryAPI = async () => {
    if (newAccountHistoryAPIRpc.trim().length > 0) {
      if (ValidUrl.isWebUri(newAccountHistoryAPIRpc)) {
        if (
          !accountHistoryAPIList.find(
            (item) => item.value === newAccountHistoryAPIRpc,
          )
        ) {
          await HiveEngineConfigUtils.addCustomAccountHistoryApi(
            newAccountHistoryAPIRpc,
          );
          if (newAccountHistoryAPIAsActive) {
            setAccountHistoryRpc(newAccountHistoryAPIRpc);
            HiveEngineConfigUtils.setActiveAccountHistoryApi(
              newAccountHistoryAPIRpc,
            );
          }
          setNewAccountHistoryAPIRpc('');
          setAddNewAccountHistoryAPI(false);
          setNewAccountHistoryAPIAsActive(false);
          SimpleToast.show(translate('toast.rpc_node_added_success'), {
            duration: SimpleToast.durations.LONG,
          });
          init();
        } else {
          SimpleToast.show(
            translate('settings.settings.rpc_node_already_exists'),
            {
              duration: SimpleToast.durations.LONG,
            },
          );
        }
      } else {
        SimpleToast.show(translate('common.invalid_url'), {
          duration: SimpleToast.durations.LONG,
        });
      }
    }
  };

  const onHandleRemoveAccountHistoryAPI = async (item: string) => {
    if (HiveEngineConfigUtils.getAccountHistoryApi() === item) {
      setAccountHistoryRpc(DEFAULT_ACCOUNT_HISTORY_RPC_NODE);
      HiveEngineConfigUtils.setActiveAccountHistoryApi(
        DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
      );
    }
    await HiveEngineConfigUtils.deleteCustomAccountHistoryApi(item);
    SimpleToast.show(translate('toast.rpc_node_removed_success'), {
      duration: SimpleToast.durations.LONG,
    });
    init();
  };

  const onHandleSelectAccountHistoryAPI = (item: string) => {
    setAccountHistoryRpc(item);
    HiveEngineConfigUtils.setActiveAccountHistoryApi(item);
    init();
  };

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      <ScrollView style={styles.container}>
        <FocusAwareStatusBar />
        <View
          style={{
            width: '100%',
          }}>
          <Separator height={10} />
          <Caption text="settings.settings.rpc_disclaimer" hideSeparator />
          {/* <Text style={[styles.title, styles.text]}>
            {translate('settings.settings.hive_rpc')}
          </Text> */}
          <Separator />
          <Text style={styles.title}>
            {translate('settings.settings.hive_rpc')}
          </Text>
          <CheckBoxPanel
            checked={switchRPCAuto}
            onPress={() => {
              AsyncStorage.setItem(
                KeychainStorageKeyEnum.SWITCH_RPC_AUTO,
                String(!switchRPCAuto),
              );
              setSwitchRPCAuto(!switchRPCAuto);
            }}
            title={'settings.settings.switch_auto'}
            subTitle="settings.settings.switch_auto_info"
          />

          {!switchRPCAuto && renderRpcItem()}
        </View>
        <Separator />
        {hiveEngineRPCList.length > 0 && (
          <>
            <Text style={styles.title}>
              {translate('settings.settings.hive_engine_rpc')}
            </Text>
            <CheckBoxPanel
              checked={switchHiveEngineRPCAuto}
              onPress={() => {
                AsyncStorage.setItem(
                  KeychainStorageKeyEnum.SWITCH_HE_RPC_AUTO,
                  String(!switchHiveEngineRPCAuto),
                );
                setSwitchHiveEngineRPCAuto(!switchHiveEngineRPCAuto);
                loadUserTokens(active.account.name);
              }}
              title={'settings.settings.switch_auto'}
              subTitle="settings.settings.switch_auto_info_he"
            />
            {!switchHiveEngineRPCAuto && (
              <RpcComponent
                title={'settings.settings.hive_engine_rpc'}
                theme={theme}
                rpcList={hiveEngineRPCList}
                selectedRPC={activeHiveEngineRpc}
                placeHolderInput={translate('settings.settings.new_HE_rpc')}
                input={newHERpc}
                onChangeInput={(text) => setNewHERpc(text)}
                checkBoxTitle={translate('settings.settings.set_as_active')}
                onHandleSave={onHandleAddCustomHERpc}
                onChangeCheckBox={() => setNewHERPCAsActive(!newHERPCAsActive)}
                checkedValue={newHERPCAsActive}
                addNewRpc={addNewHERpc}
                setAddNewRpc={() => setAddNewHERpc(!addNewHERpc)}
                onRemoveDropdownItem={onHandleRemoveCustomHERpc}
                onSelectedDropdown={onHandleSelectHERpc}
              />
            )}
          </>
        )}
        <Separator />
        {accountHistoryAPIList.length > 0 && (
          <>
            <Text style={styles.title}>
              {translate('settings.settings.hive_engine_account_history_api')}
            </Text>
            <RpcComponent
              title={'settings.settings.hive_engine_account_history_api'}
              theme={theme}
              rpcList={accountHistoryAPIList}
              selectedRPC={activeAccountHistoryAPIRpc}
              placeHolderInput={translate(
                'settings.settings.new_account_history_rpc',
              )}
              input={newAccountHistoryAPIRpc}
              onChangeInput={(text) => setNewAccountHistoryAPIRpc(text)}
              checkBoxTitle={translate('settings.settings.set_as_active')}
              onHandleSave={onHandleAddCustomAccountHistoryAPI}
              onChangeCheckBox={() =>
                setNewAccountHistoryAPIAsActive(!newAccountHistoryAPIAsActive)
              }
              checkedValue={newAccountHistoryAPIAsActive}
              addNewRpc={addNewAccountHistoryAPI}
              setAddNewRpc={() =>
                setAddNewAccountHistoryAPI(!addNewAccountHistoryAPI)
              }
              onRemoveDropdownItem={onHandleRemoveAccountHistoryAPI}
              onSelectedDropdown={onHandleSelectAccountHistoryAPI}
              additionalListExpandedContainerStyle={{
                maxHeight: DROPDOWN_CONTENT_MAX_HEIGHT,
              }}
            />
          </>
        )}
      </ScrollView>
    </Background>
  );
};

const getStyles = (theme: Theme, width: number, height: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: MARGIN_PADDING,
      flex: 1,
    },
    title: {
      marginBottom: 5,
      marginLeft: LABEL_INDENT_SPACE,
      color: getColors(theme).secondaryText,
      fontWeight: 'bold',
      fontSize: 16,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_3,
      fontSize: getFontSizeSmallDevices(width, 13),
    },
    opacity: {
      opacity: 0.7,
    },
    marginVertical: {
      marginVertical: 15,
    },

    rpcItemContainer: {
      flexDirection: 'row',
      width: 'auto',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: MARGIN_LEFT_RIGHT_MIN,
    },
    addButtonContainer: {
      justifyContent: 'flex-end',
    },

    addButton: {
      alignItems: 'center',
      borderRadius: 30,
      paddingHorizontal: 0,
      paddingVertical: 0,
      width: 48,
      height: 48,
      justifyContent: 'center',
      marginBottom: 0,
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bottomLine: {
      marginVertical: 8,
      borderColor: getColors(theme).lineSeparatorStroke,
    },
    input: {
      marginHorizontal: 0,
    },
    dropdownIconDimensions: {width: 15, height: 15},
    bottomLineDropdownItem: {
      borderWidth: 1,
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      alignSelf: 'center',
    },
    dropdown: {width: 0.7 * width},
  });

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
  accounts: state.accounts,
  active: state.activeAccount,
  rpc: state.settings.rpc,
  activeHiveEngineRpc: state.settings.hiveEngineRpc,
  activeAccountHistoryAPIRpc: state.settings.accountHistoryAPIRpc,
});

const connector = connect(mapStateToProps, {
  setHiveEngineRpc,
  setAccountHistoryRpc,
  setRpc,
  loadUserTokens,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RpcNodes);
