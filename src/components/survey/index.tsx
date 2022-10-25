import AsyncStorage from '@react-native-community/async-storage';
import EllipticButton from 'components/form/EllipticButton';
import moment from 'moment';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
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
    console.log(+survey);
    console.log(
      +survey !== SurveyData.id,
      !moment(Date.now()).isSameOrAfter(SurveyData.expirationDate),
    );
    if (
      +survey !== SurveyData.id &&
      !moment(Date.now()).isSameOrAfter(SurveyData.expirationDate)
    ) {
      navigate('ModalScreen', {
        name: `Operation_Survey`,
        modalContent: renderContent(),
        onForceCloseModal: () => {},
      });
    }
  };

  const renderContent = () => (
    <View style={{height: '100%'}}>
      <Text style={styles.title}>{SurveyData.title}</Text>
      <FastImage
        style={styles.image}
        source={{uri: SurveyData.image}}
        resizeMode={FastImage.resizeMode.contain}
      />
      {SurveyData.description.map((paragraph) => (
        <Text style={styles.description}>{paragraph}</Text>
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
          style={styles.button}
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

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  description: {fontSize: 16, textAlign: 'justify', marginBottom: 10},
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
  },
  no: {
    textDecorationColor: 'black',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default Survey;
