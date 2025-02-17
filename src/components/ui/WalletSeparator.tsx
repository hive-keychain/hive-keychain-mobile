import HiveEngineLogo from 'assets/new_UI/hive-engine.svg';
import CustomSearchBar from 'components/form/CustomSearchBar';
import Icon from 'components/hive/Icon';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';

type Props = {
  theme: Theme;
  RightIcon: JSX.Element;
} & (
  | {
      hasSearch: true;
      searchValue: string;
      setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    }
  | {hasSearch: false; searchValue: undefined; setSearchValue: undefined}
);
const WalletSeparator = ({
  theme,
  searchValue,
  setSearchValue,
  RightIcon,
}: Props) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const styles = getStyles(theme);
  return (
    <View style={[getCardStyle(theme).wrapperCardItem]}>
      <View
        style={[
          styles.flexRow,
          isSearchOpen ? styles.paddingVertical : undefined,
        ]}>
        <HiveEngineLogo height={23} width={23} />
        <View style={styles.separatorContainer} />
        {isSearchOpen ? (
          <CustomSearchBar
            theme={theme}
            value={searchValue}
            onChangeText={(text) => {
              setSearchValue(text);
            }}
            additionalContainerStyle={[
              styles.searchContainer,
              isSearchOpen ? styles.borderLight : undefined,
            ]}
            rightIcon={
              <Icon
                name={Icons.SEARCH}
                theme={theme}
                width={18}
                height={18}
                onPress={() => {
                  setSearchValue('');
                  setIsSearchOpen(false);
                }}
              />
            }
          />
        ) : (
          <>
            <Icon
              name={Icons.SEARCH}
              theme={theme}
              additionalContainerStyle={styles.search}
              onPress={() => {
                setIsSearchOpen(true);
              }}
              width={18}
              height={18}
            />
            {RightIcon}
          </>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    paddingVertical: {paddingVertical: 10},
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 4,
      paddingVertical: 8,
    },

    search: {
      marginRight: 10,
    },
    separatorContainer: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      height: 1,
      backgroundColor: getColors(theme).separatorBgColor,
      marginHorizontal: 10,
      width: '75%',
      flexShrink: 1,
    },
    borderLight: {
      borderColor: getColors(theme).cardBorderColor,
      borderWidth: 1,
    },
    searchContainer: {
      position: 'absolute',
      right: 0,
      zIndex: 10,
      height: 45,
    },
  });

export default WalletSeparator;
