import {DrawerContentComponentProps} from '@react-navigation/drawer';
import Heart from 'assets/new_UI/heart.svg';
import PickerItem from 'components/form/PickerItem';
import CloseButton from 'components/ui/CloseButton';
import React from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {chainItemList} from 'src/reference-data/chainDropdownlist';
import {getColors} from 'src/styles/colors';
import {PADDINGLEFTMAINMENU} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';

export default ({
  theme,
  props,
}: {
  theme: Theme;
  props: DrawerContentComponentProps;
}) => {
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <CloseButton
          theme={theme}
          onPress={() => props.navigation.closeDrawer()}
        />
        <Text style={styles.textHeader}>{translate('common.menu')}</Text>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.flexRowCentered}>
          <Text style={styles.textSubHeader}>
            {capitalizeSentence(translate('drawerFooter.madeBy_part_1'))}
          </Text>
          <View style={styles.heartContainer}>
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
        <View style={[{alignItems: 'center'}]}>
          <Text style={[styles.textLabel]}>
            {translate('multichain.switch_chain')}
          </Text>
        </View>
        <View style={[styles.dropdownContainer]}>
          <PickerItem
            disabled
            theme={theme}
            pickerItemList={chainItemList}
            selected={chainItemList[1]}
          />
        </View>
      </View>
    </View>
  );
};

const getDimensionedStyles = ({width, height}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      width: '95%',
      marginTop: 8,
      zIndex: 1,
      paddingLeft: PADDINGLEFTMAINMENU,
    },
    topContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      width: '55%',
      alignSelf: 'flex-start',
      marginBottom: 15,
      height: 30,
    },
    middleContainer: {
      width: '70%',
      alignSelf: 'flex-start',
      height: 45.4,
    },
    bottomContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 25,
      marginTop: 25,
    },
    textHeader: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(
        height,
        headlines_primary_headline_2.fontSize,
      ),
    },
    textSubHeader: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      opacity: 0.6,
      fontSize: getFontSizeSmallDevices(height, 15),
    },
    textLabel: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(height, 14),
    },
    heartIcon: {
      width: 22,
      height: 22,
    },
    heartContainer: {alignItems: 'center', paddingHorizontal: 6},
    flexRowCentered: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dropdownContainer: {
      width: '52%',
    },
  });
