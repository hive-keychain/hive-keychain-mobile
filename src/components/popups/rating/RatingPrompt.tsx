import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation.utils';
import {RatingsUtils} from 'utils/ratings.utils';

interface Props {
  navigation: WalletNavigation;
}

const FEEDBACK_URL = 'https://discord.gg/3EM6YfRrGv';

const RatingPrompt = ({
  navigation,
  activeScreen,
}: Props & PropsFromRedux): null => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  useEffect(() => {
    (async () => {
      const isModalOpen = activeScreen?.startsWith('ModalScreen');
      if (!isModalOpen && (await RatingsUtils.shouldPromptNow())) {
        navigate('ModalScreen', {
          name: 'RatingPrompt',
          fixedHeight: 0.35,
          modalContent: renderContent(),
          modalContainerStyle: getModalBaseStyle(theme).roundedTop,
          onForceCloseModal: () => {},
        });
      }
    })();
  }, [activeScreen]);

  const renderContent = () => {
    return (
      <View style={styles.rootContainer}>
        <View style={{flexGrow: 1}}>
          <Text style={styles.title}>{translate('popup.rating.title')}</Text>
          <Text style={styles.text}>
            {translate('popup.rating.description')}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
            }}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
                fontWeight: 'bold',
                color: getColors(theme).secondaryText,
                textDecorationColor: getColors(theme).secondaryText,
                textDecorationLine: 'underline',
              }}
              onPress={async () => {
                await RatingsUtils.markPrompted();
                Linking.openURL(FEEDBACK_URL);
                goBack();
              }}>
              {translate('popup.rating.negative')}
            </Text>
          </View>
          <EllipticButton
            isLoading={false}
            isWarningButton
            style={{width: 160}}
            title={translate('popup.rating.positive')}
            onPress={async () => {
              await RatingsUtils.openReview();
              goBack();
            }}
          />
        </View>
        <Separator height={initialWindowMetrics.insets.bottom + 20} />
      </View>
    );
  };

  return null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    rootContainer: {
      width: '100%',
      flex: 1,
      padding: 12,
    },
    title: {
      textAlign: 'center',
      color: getColors(theme).secondaryText,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
      marginBottom: 10,
      color: getColors(theme).secondaryText,
      textAlign: 'center',
    },
  });

const connector = connect((state: RootState) => ({
  activeScreen: state.navigation.activeScreen,
}));

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RatingPrompt);
