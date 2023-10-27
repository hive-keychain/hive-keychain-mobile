import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {body_primary_body_2} from 'src/styles/typography';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';
//TODO Keep working bellow
const RpcNodes = () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [switchRPCAuto, setSwitchRPCAuto] = useState(false);

  const renderRpcItem = () => {
    return (
      <View style={styles.rpcItemContainer}>
        <View style={[getCardStyle(theme).defaultCardItem, styles.flexRow]}>
          <Text style={[styles.text, {...body_primary_body_2}]}>RPC here</Text>
          <Icon name="expand_thin" theme={theme} {...styles.clickeableIcon} />
        </View>
        <TouchableOpacity style={getCardStyle(theme).defaultCardItem}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Background using_new_ui theme={theme}>
      <View style={styles.container}>
        <FocusAwareStatusBar />
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
        {renderRpcItem()}
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  //TODO bellow cleanup styles
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: 16},
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
    flexRow: {
      flexDirection: 'row',
      width: '80%',
      justifyContent: 'space-between',
    },
    clickeableIcon: {
      width: 12,
      height: 12,
    },
  });

export default RpcNodes;
