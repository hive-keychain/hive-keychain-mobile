import {forgetKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import SafeArea from 'components/ui/SafeArea';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  button_link_primary_medium,
  headlines_primary_headline_1,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';

type Props = PropsFromRedux & {name: string; type: KeyTypes};

const RemoveKey = ({forgetKey, name, type}: Props) => {
  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  return (
    <SafeArea skipTop style={styles.container}>
      <Text style={styles.title}>{translate('settings.keys.remove')}</Text>
      <Text style={[styles.text, styles.smallerText]}>
        {translate('settings.keys.remove_info', {username: name, type})}
      </Text>
      <EllipticButton
        title={translate('common.confirm')}
        onPress={() => {
          forgetKey(name, type);
          goBack();
        }}
        style={[
          getButtonStyle(theme, width).warningStyleButton,
          {marginBottom: 10},
        ]}
        isWarningButton
        additionalTextStyle={{...button_link_primary_medium}}
      />
    </SafeArea>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {justifyContent: 'space-between', flex: 1, paddingVertical: 24},
    text: {color: getColors(theme).primaryText, ...body_primary_body_1},
    title: {
      color: getColors(theme).primaryText,
      ...headlines_primary_headline_1,
      fontSize: 18,
      textAlign: 'center',
    },
    smallerText: {
      fontSize: 13,
    },
  });

const connector = connect(null, {forgetKey});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RemoveKey);
