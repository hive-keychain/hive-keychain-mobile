import {loadAccount} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import Separator from 'components/ui/Separator';
import {ConfirmationPageRoute} from 'navigators/Root.types';
import React, {useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonHeight, getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation';
import OperationThemed from './OperationThemed';

export type ConfirmationPageProps = {
  onSend: () => void;
  title: string;
  introText?: string;
  warningText?: string;
  data: ConfirmationData[];
};

type ConfirmationData = {
  title: string;
  value: string;
};

const ConfirmationPage = ({
  route,
  loadAccount,
  user,
}: {
  route: ConfirmationPageRoute;
} & PropsFromRedux) => {
  const {onSend, title, introText, warningText, data} = route.params;
  const [loading, setLoading] = useState(false);
  console.log(route.params);
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles({width, height}, theme);
  console.log(title);
  return (
    <OperationThemed
      childrenTop={<Separator height={50} />}
      childrenMiddle={
        <View>
          <Separator height={35} />
          <Text style={[getFormFontStyle(height, theme).title, styles.info]}>
            {translate(title)}
          </Text>
          <Separator />
          {warningText && (
            <Text
              style={[
                getFormFontStyle(height, theme).infoLabel,
                styles.warning,
              ]}>
              {warningText}
            </Text>
          )}
          <Separator />
          {data.map((e, i) => (
            <>
              <View style={styles.justifyCenter}>
                <View style={[styles.flexRowBetween, styles.width95]}>
                  <Text style={[getFormFontStyle(height, theme).title]}>
                    {translate(e.title)}
                  </Text>
                  <Text
                    style={[
                      getFormFontStyle(height, theme).title,
                      styles.textContent,
                    ]}>
                    {e.value}
                  </Text>
                </View>
                {i !== data.length - 1 && (
                  <Separator
                    drawLine
                    height={0.5}
                    additionalLineStyle={styles.bottomLine}
                  />
                )}
              </View>
              <Separator />
            </>
          ))}
        </View>
      }
      childrenBottom={
        <View style={styles.operationButtonsContainer}>
          <ActiveOperationButton
            title={translate('common.confirm')}
            onPress={async () => {
              setLoading(true);
              Keyboard.dismiss();
              await onSend();
              setLoading(false);
              loadAccount(user.account.name, true);
              resetStackAndNavigate('WALLET');
            }}
            style={[
              styles.operationButton,
              getButtonStyle(theme, height).warningStyleButton,
            ]}
            additionalTextStyle={getFormFontStyle(height, theme, 'white').title}
            isLoading={loading}
          />
        </View>
      }
      additionalContentContainerStyle={styles.paddingHorizontal}
    />
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    warning: {color: 'red'},
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    info: {
      opacity: 0.7,
    },
    textContent: {
      color: getColors(theme).senaryText,
    },
    bottomLine: {
      width: '100%',
      borderColor: getColors(theme).secondaryLineSeparatorStroke,
      margin: 0,
      marginTop: 12,
    },
    width95: {
      width: '95%',
    },
    justifyCenter: {justifyContent: 'center', alignItems: 'center'},
    operationButtonsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 20,
      justifyContent: 'space-around',
      width: '100%',
    },
    operationButton: {
      marginHorizontal: 0,
      height: getButtonHeight(width),
    },
    operationButtonConfirmation: {
      backgroundColor: '#FFF',
    },
    paddingHorizontal: {
      paddingHorizontal: 18,
    },
  });

const connector = connect((state: RootState) => ({user: state.activeAccount}), {
  loadAccount,
});

type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ConfirmationPage);
