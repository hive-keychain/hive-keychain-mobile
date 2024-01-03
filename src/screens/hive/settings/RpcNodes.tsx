import {Rpc} from 'actions/interfaces';
import {setAccountHistoryRpc, setHiveEngineRpc, setRpc} from 'actions/settings';
import CustomDropdown, {DropdownItem} from 'components/form/CustomDropdown';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {
  DefaultAccountHistoryApis,
  DefaultHiveEngineRpcs,
} from 'src/interfaces/hive-engine-rpc.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {HiveEngineConfigUtils} from 'utils/hive-engine-config.utils';
import {rpcList} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {addCustomRpc, deleteCustomRpc, getCustomRpcs} from 'utils/rpc.utils';
import * as ValidUrl from 'valid-url';
import AddCustomRPC from './AddCustomRPC';

const DEFAULT_CUSTOM_RPC = {
  uri: '',
  testnet: false,
};
export const DEFAULT_HE_RPC_NODE = 'https://engine.rishipanthee.com';
export const DEFAULT_ACCOUNT_HISTORY_RPC_NODE =
  'https://history.hive-engine.com';
//TODO very imporant while refactoring.
//  - add actions within settings reducers t oset HERPC & AHRPC so they will persist!
const RpcNodes = ({
  setRpc,
  settings,
  activeRpc,
  setHiveEngineRpc,
  setAccountHistoryRpc,
  activeHiveEngineRpc,
  activeAccountHistoryAPIRpc,
}: PropsFromRedux) => {
  //Hive RPC
  const [showAddCustomRPC, setShowAddCustomRPC] = useState(false);
  const [customRPCSetActive, setCustomRPCSetActive] = useState<boolean>(false);
  const [customRPC, setCustomRPC] = useState<Rpc>(DEFAULT_CUSTOM_RPC);
  const [switchRPCAuto, setSwitchRPCAuto] = useState(false);
  const [rpcFullList, setRpcFullList] = useState<DropdownItem[]>([]);
  const [customRPCList, setCustomRPCList] = useState<Rpc[]>([]);

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme, useWindowDimensions().height);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (switchRPCAuto) {
      if (typeof activeRpc === 'object' && activeRpc.uri !== 'DEFAULT') {
        if (typeof activeRpc === 'string' && activeRpc !== 'DEFAULT') {
          setRpc('DEFAULT');
        }
      }
    }
  }, [switchRPCAuto]);

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
    } as DropdownItem;
  };

  const init = async () => {
    //init Hive RPCs
    if (typeof settings.rpc === 'object') {
      if (settings.rpc.uri === 'DEFAULT') setSwitchRPCAuto(true);
    } else if (typeof settings.rpc === 'string') {
      if (settings.rpc === 'DEFAULT') setSwitchRPCAuto(true);
    }
    const customRPCs = await getCustomRpcs();
    setCustomRPCList(customRPCs);
    const finalDropdownRpcList = [
      ...rpcList.map((item) => getDropdownItem(item.uri, true, false)),
      ...customRPCs.map((item) => getDropdownItem(item.uri, true, true)),
    ];
    setRpcFullList(finalDropdownRpcList);

    //Init Hive Engine RPCs
    let tempHiveEngineRpc = [...DefaultHiveEngineRpcs];
    const customHERpcList = await HiveEngineConfigUtils.getCustomRpcs();
    const finalDropdownHERpcList = [
      ...tempHiveEngineRpc.map((item) => getDropdownItem(item, true, false)),
      ...customHERpcList.map((item) => getDropdownItem(item, true, true)),
    ];
    setHiveEngineRPCList(finalDropdownHERpcList);

    //Init Account History API
    const tempAccountHistoryAPI = [...DefaultAccountHistoryApis];
    const customAccountHistoryAPIList = await HiveEngineConfigUtils.getCustomAccountHistoryApi();
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
        if (customRPCSetActive) setRpc(customRPC.uri);
        setCustomRPCSetActive(false);
        setShowAddCustomRPC(false);
        setCustomRPC(DEFAULT_CUSTOM_RPC);
        SimpleToast.show(
          translate('toast.rpc_node_added_success'),
          SimpleToast.LONG,
        );
      } else {
        SimpleToast.show(
          translate('settings.settings.rpc_node_already_exists'),
          SimpleToast.LONG,
        );
      }
    } else {
      SimpleToast.show(translate('common.invalid_url'), SimpleToast.LONG);
    }
  };

  const handleOnRemoveCustomRPC = async (uri: string) => {
    if (uri === (settings.rpc as string) || uri === (settings.rpc as Rpc).uri)
      setRpc('DEFAULT');
    await deleteCustomRpc(customRPCList, {uri});
    const updatedFullList = [...rpcFullList];
    setRpcFullList(updatedFullList.filter((removed) => removed.value !== uri));
  };

  const onHandleSetRPC = (item: string) => {
    setRpc(item);
  };

  const renderRpcItem = () => {
    return (
      <>
        <View style={styles.rpcItemContainer}>
          <CustomDropdown
            titleTranslationKey="settings.settings.add_rpc_title"
            behaviour="overlay"
            theme={theme}
            list={rpcFullList}
            selected={typeof activeRpc === 'object' ? activeRpc.uri : activeRpc}
            onSelected={onHandleSetRPC}
            onRemove={(item) => handleOnRemoveCustomRPC(item)}
            additionalContainerStyle={styles.flex85}
          />
          <TouchableOpacity
            style={[getCardStyle(theme).defaultCardItem, styles.addButton]}
            onPress={() => setShowAddCustomRPC(!showAddCustomRPC)}>
            <Text style={styles.text}>{showAddCustomRPC ? 'x' : '+'}</Text>
          </TouchableOpacity>
        </View>
        {showAddCustomRPC && renderAddCustomRPC()}
      </>
    );
  };

  const renderAddCustomRPC = () => {
    return (
      <View style={[getCardStyle(theme).defaultCardItem]}>
        <View style={styles.flexRow}>
          <Text style={styles.text}>
            {translate('settings.settings.add_rpc_title')}
          </Text>
          <Icon theme={theme} name={Icons.RAM} onClick={handleAddCustomRPC} />
        </View>
        <Separator
          drawLine
          height={0.5}
          additionalLineStyle={styles.bottomLine}
        />
        <OperationInput
          placeholder={translate('settings.settings.rpc_node')}
          value={customRPC.uri}
          additionalInputContainerStyle={styles.input}
          inputStyle={styles.text}
          onChangeText={(value) => handleSetCustomRPC(value, 'uri')}
        />
        <CheckBox
          checked={customRPC.testnet}
          onPress={() => handleSetCustomRPC(!customRPC.testnet, 'testnet')}
          title={translate('settings.settings.testnet')}
          containerStyle={styles.checkBox}
          textStyle={styles.text}
          checkedColor={getColors(theme).icon}
        />
        <CheckBox
          checked={customRPCSetActive}
          onPress={() => setCustomRPCSetActive(!customRPCSetActive)}
          title={translate('settings.settings.set_as_active')}
          containerStyle={styles.checkBox}
          textStyle={styles.text}
          checkedColor={getColors(theme).icon}
        />
      </View>
    );
  };

  //HIVE Engine RPC
  const [hiveEngineRPCList, setHiveEngineRPCList] = useState<DropdownItem[]>(
    [],
  );
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
          SimpleToast.show(
            translate('toast.rpc_node_added_success'),
            SimpleToast.LONG,
          );
          init();
        } else {
          SimpleToast.show(
            translate('settings.settings.rpc_node_already_exists'),
            SimpleToast.LONG,
          );
        }
      } else {
        SimpleToast.show(translate('common.invalid_url'), SimpleToast.LONG);
      }
    }
  };

  const onHandleRemoveCustomHERpc = async (item: string) => {
    if (HiveEngineConfigUtils.getApi() === item) {
      setHiveEngineRpc(DEFAULT_HE_RPC_NODE);
      HiveEngineConfigUtils.setActiveApi(DEFAULT_HE_RPC_NODE);
    }
    await HiveEngineConfigUtils.deleteCustomRpc(item);
    SimpleToast.show(
      translate('toast.rpc_node_removed_success'),
      SimpleToast.LONG,
    );
    init();
  };

  const onHandleSelectHERpc = (item: string) => {
    setHiveEngineRpc(item);
    HiveEngineConfigUtils.setActiveApi(item);
    init();
  };

  //Account History API
  const [accountHistoryAPIList, setAccountHistoryAPIList] = useState<
    DropdownItem[]
  >([]);
  const [newAccountHistoryAPIRpc, setNewAccountHistoryAPIRpc] = useState('');
  const [addNewAccountHistoryAPI, setAddNewAccountHistoryAPI] = useState(false);
  const [
    newAccountHistoryAPIAsActive,
    setNewAccountHistoryAPIAsActive,
  ] = useState(false);

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
          SimpleToast.show(
            translate('toast.rpc_node_added_success'),
            SimpleToast.LONG,
          );
          init();
        } else {
          SimpleToast.show(
            translate('settings.settings.rpc_node_already_exists'),
            SimpleToast.LONG,
          );
        }
      } else {
        SimpleToast.show(translate('common.invalid_url'), SimpleToast.LONG);
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
    SimpleToast.show(
      translate('toast.rpc_node_removed_success'),
      SimpleToast.LONG,
    );
    init();
  };

  const onHandleSelectAccountHistoryAPI = (item: string) => {
    setAccountHistoryRpc(item);
    HiveEngineConfigUtils.setActiveAccountHistoryApi(item);
    init();
  };

  return (
    <Background theme={theme}>
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <View>
          <Separator height={10} />
          {//@ts-ignore
          translate('settings.settings.disclaimer').map((disclaimer, i) => (
            <Text key={i} style={[styles.textInfo, styles.paddingHorizontal]}>
              {disclaimer}
            </Text>
          ))}
          <Separator />
          <Text style={styles.text}>
            {translate('settings.settings.hive_rpc')}
          </Text>
          <View
            style={[
              getCardStyle(theme).defaultCardItem,
              styles.checkBoxContainer,
            ]}>
            <CheckBox
              checked={switchRPCAuto}
              onPress={() => setSwitchRPCAuto(!switchRPCAuto)}
              title={translate('settings.settings.switch_auto')}
              containerStyle={styles.checkBox}
              textStyle={styles.text}
              checkedColor={getColors(theme).icon}
            />
            <Text
              style={[
                styles.textInfo,
                styles.smallerFont,
                styles.paddingHorizontal,
              ]}>
              {translate('settings.settings.switch_auto_info')}
            </Text>
          </View>
          <Separator />
          {!switchRPCAuto && renderRpcItem()}
        </View>
        <ScrollView>
          {hiveEngineRPCList.length > 0 && (
            <AddCustomRPC
              titleTranslationKey="settings.settings.hive_engine_rpc"
              theme={theme}
              rpcList={hiveEngineRPCList}
              selectedRPC={cleanRpcLabel(activeHiveEngineRpc)}
              title={translate('settings.settings.hive_engine_rpc')}
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
          {accountHistoryAPIList.length > 0 && (
            <AddCustomRPC
              titleTranslationKey="settings.settings.hive_engine_account_history_api"
              theme={theme}
              rpcList={accountHistoryAPIList}
              selectedRPC={cleanRpcLabel(activeAccountHistoryAPIRpc)}
              title={translate(
                'settings.settings.hive_engine_account_history_api',
              )}
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
            />
          )}
        </ScrollView>
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, height: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flex: 1,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(height, 15),
    },
    opacity: {
      opacity: 0.7,
    },
    marginVertical: {
      marginVertical: 15,
    },
    paddingHorizontal: {
      paddingHorizontal: 10,
    },
    textInfo: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(height, 15),
      opacity: 0.7,
    },
    smallerFont: {
      fontSize: 12,
    },
    checkBox: {
      width: '100%',
      margin: 0,
      paddingLeft: 0,
      backgroundColor: '#00000000',
      borderWidth: 0,
      alignContent: 'center',
    },
    checkBoxContainer: {
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    rpcItemContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    rpcDropdown: {
      width: '80%',
      minHeight: 50,
    },
    flex85: {width: '85%'},
    addButton: {
      minHeight: 50,
      alignItems: 'center',
      borderRadius: 30,
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
    button: {marginBottom: 20},
  });

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
  accounts: state.accounts,
  active: state.activeAccount,
  activeRpc: state.settings.rpc,
  activeHiveEngineRpc: state.settings.hiveEngineRpc,
  activeAccountHistoryAPIRpc: state.settings.accountHistoryAPIRpc,
});
const connector = connect(mapStateToProps, {
  setRpc,
  setHiveEngineRpc,
  setAccountHistoryRpc,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(RpcNodes);
