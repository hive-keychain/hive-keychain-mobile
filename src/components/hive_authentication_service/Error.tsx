import Hive from 'assets/images/hive/icon_hive.svg';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import {ModalNavigation} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {FontPoppinsName, body_primary_body_3} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & {
  text: string;
  navigation: ModalNavigation;
};

const HASError = ({text, navigation}: Props) => {
  const onConfirm = () => {
    navigation.goBack();
  };
  setTimeout(() => {
    navigation.goBack();
  }, 10000);

  const {theme} = useThemeContext();
  const styles = getSTyles(theme);

  return (
    <Operation
      logo={<Hive />}
      title={translate('common.error_title')}
      additionalHeaderTitleStyle={[styles.text, styles.title]}>
      <View style={styles.view}>
        <Text style={styles.text}>{text}</Text>
        <EllipticButton
          title={translate('common.ok')}
          onPress={onConfirm}
          style={getButtonStyle(theme).warningStyleButton}
        />
      </View>
    </Operation>
  );
};

const getSTyles = (theme: Theme) =>
  StyleSheet.create({
    view: {
      flex: 1,
      marginVertical: 30,
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },
    button: {backgroundColor: '#68A0B4'},
    error: {color: PRIMARY_RED_COLOR},
    uuid: {fontWeight: 'bold'},
    text: {
      ...body_primary_body_3,
      color: getColors(theme).secondaryText,
      fontSize: 14,
    },
    title: {
      fontFamily: FontPoppinsName.SEMI_BOLD,
      fontSize: 16,
    },
  });

const connector = connect((state: RootState) => {
  return {
    accounts: state.accounts,
  };
});

type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(HASError);
