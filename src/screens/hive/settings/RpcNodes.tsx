import {setRpc} from 'actions/index';
import {Rpc} from 'actions/interfaces';
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
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {
  DefaultAccountHistoryApis,
  DefaultHiveEngineRpcs,
} from 'src/interfaces/hive-engine-rpc.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {body_primary_body_2} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalizeSentence} from 'utils/format';
import {rpcList} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {addCustomRpc, deleteCustomRpc, getCustomRpcs} from 'utils/rpc.utils';
import * as ValidUrl from 'valid-url';
import AddCustomRPC from './AddCustomRPC';

const DEFAULT_CUSTOM_RPC = {
  uri: '',
  testnet: false,
};
//TODO important here:
//  1. add HE rpc nodes selection(as the one we have), user can add custom ones
//  2. also for the hsitory api. history api
const RpcNodes = ({setRpc, settings}: PropsFromRedux) => {
  //Hive RPC
  const [showAddCustomRPC, setShowAddCustomRPC] = useState(false);
  const [customRPCSetActive, setCustomRPCSetActive] = useState<boolean>(false);
  const [customRPC, setCustomRPC] = useState<Rpc>(DEFAULT_CUSTOM_RPC);
  const [switchRPCAuto, setSwitchRPCAuto] = useState(false);
  const [rpcFullList, setRpcFullList] = useState<DropdownItem[]>([]);
  const [customRPCList, setCustomRPCList] = useState<Rpc[]>([]);

  //Hive Engine RPC
  const [hiveEngineRPCList, setHiveEngineRPCList] = useState<DropdownItem[]>(
    [],
  );

  //Hive Engine account history
  const [accountHistoryAPIList, setAccountHistoryAPIList] = useState<
    DropdownItem[]
  >([]);

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    //TODO bellow important: use Asyncstorage to set/edit/remove the custom/defaults
    //init Hive RPCs
    if (typeof settings.rpc === 'object') {
      if (settings.rpc.uri === 'DEFAULT') setSwitchRPCAuto(true);
    } else if (typeof settings.rpc === 'string') {
      if (settings.rpc === 'DEFAULT') setSwitchRPCAuto(true);
    }
    const customRPCs = await getCustomRpcs();
    setCustomRPCList(customRPCs);
    const rpcListDropdownList = rpcList.map((item) => {
      return {value: item.uri, removable: false} as DropdownItem;
    });
    const customRPCsDropdownList = customRPCs.map((item) => {
      return {value: item.uri, removable: true} as DropdownItem;
    });
    setRpcFullList([...rpcListDropdownList, ...customRPCsDropdownList]);

    //Init Hive Engine RPCs
    const tempHiveEngineRpc = [...DefaultHiveEngineRpcs];
    //TODO here load custom from asyncstorage & merge.
    setHiveEngineRPCList(
      tempHiveEngineRpc.map((item) => {
        return {
          value: item,
          removable: false,
        } as DropdownItem;
      }),
    );

    //Init Account History API
    const tempAccountHistoryAPI = [...DefaultAccountHistoryApis];
    //TODO here load custom from asyncstorage & merge.
    setAccountHistoryAPIList(
      tempAccountHistoryAPI.map((item) => {
        return {
          value: item,
          removable: false,
        } as DropdownItem;
      }),
    );
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

  const renderRpcItem = () => {
    return (
      <>
        <View style={styles.rpcItemContainer}>
          <CustomDropdown
            theme={theme}
            list={rpcFullList}
            selected={
              typeof settings.rpc === 'object' ? settings.rpc.uri : settings.rpc
            }
            onSelected={(item) => {
              setRpc(item);
            }}
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
          <Icon theme={theme} name="ram" onClick={handleAddCustomRPC} />
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

  return (
    <Background using_new_ui theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        <FocusAwareStatusBar />
        <View>
          <Separator height={10} />
          {//@ts-ignore
          translate('settings.settings.disclaimer').map((disclaimer, i) => (
            <Text key={i} style={[styles.textInfo, styles.paddingHorizontal]}>
              {capitalizeSentence(disclaimer)}
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
        {hiveEngineRPCList.length > 0 && (
          <AddCustomRPC
            theme={theme}
            rpcList={hiveEngineRPCList}
            title={translate('settings.settings.hive_engine_rpc')}
            placeHolderInput={translate('settings.settings.new_HE_rpc')}
            onChangeInput={(text) => {}}
            checkBoxTitle={translate('settings.settings.set_as_active')}
            onHandleSave={() => {}}
            onChangeCheckBox={() => {}}
            checkedValue={false}
          />
        )}
        {accountHistoryAPIList.length > 0 && (
          <AddCustomRPC
            theme={theme}
            rpcList={accountHistoryAPIList}
            title={translate(
              'settings.settings.hive_engine_account_history_api',
            )}
            placeHolderInput={translate(
              'settings.settings.new_account_history_rpc',
            )}
            onChangeInput={(text) => {}}
            checkBoxTitle={translate('settings.settings.set_as_active')}
            onHandleSave={() => {}}
            onChangeCheckBox={() => {}}
            checkedValue={false}
          />
        )}
      </ScrollView>
    </Background>
  );
};

//TODO bellow check & cleanup styles
const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    flexOne: {
      flex: 1,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: 15,
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
      fontSize: 15,
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
});
const connector = connect(mapStateToProps, {
  setRpc,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(RpcNodes);
