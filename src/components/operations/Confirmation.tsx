import {loadAccount} from 'actions/index';
import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
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
import {getButtonHeight} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {spacingStyle} from 'src/styles/spacing';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation';

export type ConfirmationPageProps = {
  onSend: () => void;
  title: string;
  introText?: string;
  warningText?: string;
  skipWarningTranslation?: boolean;
  data: ConfirmationData[];
  onConfirm?: () => Promise<void>;
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
  const {
    onSend,
    title,
    introText,
    warningText,
    data,
    skipWarningTranslation,
    onConfirm: onConfirmOverride,
  } = route.params;
  const [loading, setLoading] = useState(false);
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles({width, height}, theme);

  const onConfirm = async () => {
    if (onConfirmOverride) {
      setLoading(true);
      await onConfirmOverride();
      setLoading(false);
      resetStackAndNavigate('WALLET');
    } else {
      setLoading(true);
      Keyboard.dismiss();
      await onSend();
      setLoading(false);
      loadAccount(user.name, true);
      resetStackAndNavigate('WALLET');
    }
  };
  // onConfirmOverride ||
  // (async () => {
  //   setLoading(true);
  //   Keyboard.dismiss();
  //   await onSend();
  //   setLoading(false);
  //   loadAccount(user.name, true);
  //   resetStackAndNavigate('WALLET');
  // });

  return (
    <Background theme={theme}>
      <View style={styles.confirmationPage}>
        <Caption text={title} hideSeparator />
        {/* <Separator /> */}
        {warningText && (
          <Caption
            text={warningText}
            hideSeparator
            skipTranslation={skipWarningTranslation}
          />
        )}
        <View style={[getCardStyle(theme).defaultCardItem, {marginBottom: 0}]}>
          {data.map((e, i) => (
            <>
              <View style={[styles.justifyCenter, styles.confirmItem]}>
                <View style={[styles.flexRowBetween, styles.width95]}>
                  <Text style={[getFormFontStyle(width, theme).title]}>
                    {translate(e.title)}
                  </Text>
                  <Text
                    style={[
                      getFormFontStyle(width, theme).title,
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
            </>
          ))}
        </View>
        <View style={spacingStyle.fillSpace}></View>
        <EllipticButton
          title={translate('common.confirm')}
          onPress={onConfirm}
          isLoading={loading}
          isWarningButton
        />
      </View>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    confirmationPage: {flex: 1, marginBottom: 16, paddingHorizontal: 16},
    confirmItem: {
      marginVertical: 8,
    },
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
