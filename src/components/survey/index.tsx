import AsyncStorage from '@react-native-community/async-storage';
import EllipticButton from 'components/form/EllipticButton';
import moment from 'moment';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import {ModalScreenProps} from 'navigators/Root.types';
import React, {useContext, useEffect} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {
  title_primary_body_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {navigate} from 'utils/navigation';
import {SurveyData} from './surveyData';

type Props = {
  navigation: WalletNavigation;
};

const Survey = ({navigation}: Props): null => {
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const survey = await AsyncStorage.getItem('SURVEY_ID');
    console.log('Survey: ', +survey); //TODO remove line
    console.log(
      +survey !== SurveyData.id,
      !moment(Date.now()).isSameOrAfter(SurveyData.expirationDate),
    ); //TODO remove line
    if (
      +survey !== SurveyData.id &&
      !moment(Date.now()).isSameOrAfter(SurveyData.expirationDate)
    ) {
      navigate('ModalScreen', {
        name: `Operation_Survey`,
        modalContent: renderContent(),
        onForceCloseModal: () => {},
        modalContainerStyle: styles.modalContainer,
      } as ModalScreenProps);
    }
  };

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const shadowColor = theme === Theme.LIGHT ? 'black' : PRIMARY_RED_COLOR;

  const renderContent = () => (
    <View style={styles.container}>
      <Text style={[styles.textBase, styles.title]}>{SurveyData.title}</Text>
      <FastImage
        style={[
          styles.image,
          generateBoxShadowStyle(10, 10, shadowColor, 0.8, 10, 20, shadowColor),
        ]}
        source={{uri: SurveyData.image}}
        resizeMode={FastImage.resizeMode.contain}
      />
      {SurveyData.description.map((paragraph) => (
        <Text style={[styles.textBase, styles.description]}>{paragraph}</Text>
      ))}
      <View style={styles.buttonsView}>
        <TouchableOpacity
          style={[styles.button, styles.weak]}
          onPress={async () => {
            await AsyncStorage.setItem('SURVEY_ID', SurveyData.id + '');
            navigation.goBack();
          }}>
          <Text style={styles.no}>No thanks</Text>
        </TouchableOpacity>

        <EllipticButton
          title={"Let's go!"}
          style={[styles.button, styles.activeButton]}
          additionalTextStyle={{...title_primary_title_1}}
          onPress={async () => {
            await AsyncStorage.setItem('SURVEY_ID', SurveyData.id + '');
            Linking.openURL(SurveyData.link);
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );

  return null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    title: {
      fontSize: 18,
      marginBottom: 30,
      textAlign: 'center',
    },
    description: {
      ...title_primary_title_1,
      textAlign: 'justify',
      marginBottom: 10,
    },
    image: {
      marginBottom: 30,
      aspectRatio: 1.6,
      alignSelf: 'center',
      width: '100%',
    },
    buttonsView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 40,
    },
    button: {width: '40%', marginHorizontal: 0},
    weak: {
      height: 50,
      justifyContent: 'center',
      backgroundColor: 'white',
      borderColor: theme === Theme.LIGHT ? 'gray' : undefined,
      borderWidth: theme === Theme.LIGHT ? 1 : 0,
      borderRadius: 30,
    },
    no: {
      ...title_primary_title_1,
      textDecorationColor: 'black',
      textDecorationLine: 'underline',
      textAlign: 'center',
    },
    activeButton: {
      backgroundColor: PRIMARY_RED_COLOR,
    },
    modalContainer: {
      backgroundColor: getColors(theme).primaryBackground,
    },
  });

export default Survey;
