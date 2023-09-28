import {DrawerContentComponentProps} from '@react-navigation/drawer';
import Heart from 'assets/new_UI/heart.svg';
import ItemDropdown from 'components/form/ItemDropdown';
import CloseButton from 'components/ui/CloseButton';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {chainItemList} from 'src/reference-data/chainDropdownlist';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Width} from 'utils/common.types';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';

export default ({
  theme,
  props,
}: {
  theme: Theme;
  props: DrawerContentComponentProps;
}) => {
  const {width} = useWindowDimensions();
  const styles = getDimensionedStyles({width}, theme);
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <CloseButton
          theme={theme}
          onPress={() => props.navigation.closeDrawer()}
        />
        <Text style={styles.textHeader}>Menu</Text>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.flexRowCentered}>
          <Text style={styles.textSubHeader}>
            {capitalizeSentence(translate('drawerFooter.madeBy_part_1'))}
          </Text>
          <View style={{flexGrow: 1, alignItems: 'center'}}>
            <Heart {...styles.heartIcon} />
          </View>
          <Text style={[styles.textSubHeader]}>
            {capitalizeSentence(translate('drawerFooter.madeBy_part_2'))}
          </Text>
        </View>
        <Text style={[styles.textSubHeader, {textAlign: 'center'}]}>
          {capitalizeSentence(translate('drawerFooter.madeBy_part_3'))}
        </Text>
      </View>
      <View style={[styles.bottomContainer]}>
        <Text style={styles.textLabel}>
          {translate('multichain.switch_chain')}
        </Text>
        <View style={[{width: '55%'}]}>
          <ItemDropdown theme={theme} itemDropdownList={chainItemList} />
        </View>
      </View>
    </View>
  );
};

const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      width: '95%',
      marginTop: 8,
      zIndex: 1,
      marginLeft: 20,
    },
    topContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      width: '55%',
      alignSelf: 'flex-start',
      marginBottom: 15,
    },
    middleContainer: {
      width: '75%',
      alignSelf: 'flex-start',
      marginBottom: 15,
    },
    bottomContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    textHeader: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
    },
    textSubHeader: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      opacity: 0.6,
      fontSize: 15,
    },
    textLabel: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      fontSize: 14,
    },
    pickerItemText: {
      ...body_primary_body_2,
      fontSize: 13,
    },
    heartIcon: {
      width: 22,
      height: 22,
    },
    flexRowCentered: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
