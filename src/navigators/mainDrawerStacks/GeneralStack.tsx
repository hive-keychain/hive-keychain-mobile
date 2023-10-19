import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
//TODO use just icon + add the exported only version from figma
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import {
  GeneralStackNavigationProps,
  RootStackParam,
} from 'navigators/Root.types';

const Stack = createStackNavigator<RootStackParam>();

/**
 * Note: Used to render any component we need, as a stack screen, using some themed styles.
 * @param titleScreen Title of the screen stack
 * @param component Child component(s) to render, passing its props.
 */
export default ({navigation, route}: GeneralStackNavigationProps) => {
  const {titleScreen, component} = route.params;
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  console.log({titleScreen}); //TODO remove line

  //TODO cleanup
  //   const renderOperation = () => {
  //     switch (operation) {
  //       case 'transfer':
  //         return <Transfer {...(props as TransferOperationProps)} />;
  //       case 'stake':
  //         return <StakeToken {...(props as StakeTokenOperationProps)} />;
  //       case 'unstake':
  //         return <UnstakeToken {...(props as UnstakeTokenOperationProps)} />;
  //       case 'delegate':
  //         return <DelegateToken {...(props as DelegateTokenOperationProps)} />;
  //       case 'cancel_delegation':
  //         return (
  //           <CancelTokenDelegation
  //             {...(props as CancelTokenDelegationOperationProps)}
  //           />
  //         );
  //     }
  //   };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GeneralStack"
        component={() => component}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: titleScreen,
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
