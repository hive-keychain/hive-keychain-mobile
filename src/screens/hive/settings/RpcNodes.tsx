import {setRpc} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import CustomDropdown, {DropdownItem} from 'components/form/CustomDropdown';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  button_link_primary_medium,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalizeSentence} from 'utils/format';
import {rpcList} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {addCustomRpc, deleteCustomRpc, getCustomRpcs} from 'utils/rpc.utils';
import * as ValidUrl from 'valid-url';

const DEFAULT_CUSTOM_RPC = {
  uri: '',
  testnet: false,
};

const RpcNodes = ({setRpc, settings}: PropsFromRedux) => {
  const [showAddCustomRPC, setShowAddCustomRPC] = useState(false);
  const [customRPCSetActive, setCustomRPCSetActive] = useState<boolean>(false);
  const [customRPC, setCustomRPC] = useState<Rpc>(DEFAULT_CUSTOM_RPC);
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [switchRPCAuto, setSwitchRPCAuto] = useState(
    (settings.rpc as string) === 'DEFAULT',
  );
  const [rpcFullList, setRpcFullList] = useState<DropdownItem[]>([]);
  const [customRPCList, setCustomRPCList] = useState<Rpc[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const customRPCs = await getCustomRpcs();
    setCustomRPCList(customRPCs);
    const rpcListDropdownList = rpcList.map((item) => {
      return {value: item.uri, removable: false} as DropdownItem;
    });
    const customRPCsDropdownList = customRPCs.map((item) => {
      return {value: item.uri, removable: true} as DropdownItem;
    });
    const fullList = [...rpcListDropdownList, ...customRPCsDropdownList];
    setRpcFullList(fullList);
  };

  const handleSetCustomRPC = (value: string | boolean, key: keyof Rpc) => {
    setCustomRPC((prevState) => {
      return {...prevState, [key]: value};
    });
  };

  const handleAddCustomRPC = async () => {
    //TODO add validation messages using showModal?
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
      }
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
    );
  };

  const renderAddCustomRPC = () => {
    return (
      <View style={[getCardStyle(theme).defaultCardItem]}>
        <View style={styles.flexRow}>
          <Text style={styles.text}>
            {translate('settings.settings.add_rpc_title')}
          </Text>
          <Icon theme={theme} name="ram" />
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
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <View style={styles.flexOne}>
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
          {showAddCustomRPC && renderAddCustomRPC()}
        </View>
        <ActiveOperationButton
          title={translate('common.save')}
          //TODO finish bellow
          onPress={handleAddCustomRPC}
          style={[getButtonStyle(theme).warningStyleButton, styles.button]}
          isLoading={false}
          additionalTextStyle={{...button_link_primary_medium}}
        />
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  //TODO bellow cleanup styles
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    flexOne: {
      flex: 1,
    },
    avatar: {width: 30, height: 30, borderRadius: 50},
    itemDropdown: {
      paddingHorizontal: 18,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: 15,
    },
    textNoPref: {
      textAlign: 'center',
      marginTop: 20,
    },
    searchBar: {
      borderRadius: 33,
      marginVertical: 10,
      width: '100%',
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
    flex100: {
      width: '100%',
    },
    flex85: {width: '85%'},
    clickeableIcon: {
      width: 12,
      height: 12,
    },
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
