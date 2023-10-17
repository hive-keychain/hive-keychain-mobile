import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {translate} from 'utils/localize';
//TODO use just icon + add the exported only version from figma
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import Transfer from 'components/operations/Transfer';
import {OperationNavigationProps, RootStackParam} from 'navigators/Root.types';
import {capitalize} from 'utils/format';

const Stack = createStackNavigator<RootStackParam>();

export default ({navigation, route}: OperationNavigationProps) => {
  const {operation, props} = route.params;
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  console.log({p: route.params}); //TODO remove line

  const renderOperation = () => {
    switch (operation) {
      case 'transfer':
        return <Transfer {...props} />;
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Operation"
        component={() => renderOperation()}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: `${capitalize(operation)} ${translate('navigation.tokens')}`,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
    },
    headerRightContainer: {
      marginRight: 10,
    },
    headerLeftContainer: {
      marginLeft: 10,
    },
  });
