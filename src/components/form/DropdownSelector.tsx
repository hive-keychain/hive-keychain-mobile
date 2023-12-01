import Icon from 'components/hive/Icon';
import React, {useState} from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {body_primary_body_1} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface Props {
  theme: Theme;
  list: string[];
  labelTranslationKey?: string;
  additionalContainerStyle?: StyleProp<ViewStyle>;
}

const DropdownSelector = ({
  theme,
  list,
  labelTranslationKey,
  additionalContainerStyle,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownList, setDropdownList] = useState<string[]>(list);
  const styles = getStyles(theme);

  if (isExpanded) {
    console.log({l: list.length});
  }

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <View>
        {labelTranslationKey && (
          <Text style={styles.textBase}>{translate(labelTranslationKey)}</Text>
        )}
        <View style={styles.dropdownContainer}>
          <Text style={[styles.textBase, styles.smallerText]}>HIVE</Text>
          <Icon
            theme={theme}
            name="expand_thin"
            {...styles.dropdownIcon}
            onClick={() => setIsExpanded(!isExpanded)}
            additionalContainerStyle={
              isExpanded ? getRotateStyle('180') : getRotateStyle('0')
            }
          />
        </View>
        {isExpanded && (
          <ScrollView style={styles.dropdownlist}>
            {dropdownList.map((item, index) => {
              const isLastItem = index === dropdownList.length - 1;
              return (
                <Text
                  key={`${item}-currency-selector-swap`}
                  style={[
                    styles.textBase,
                    styles.smallerText,
                    styles.marginLeft,
                    isLastItem ? {marginBottom: 10} : undefined,
                  ]}>
                  {item}
                </Text>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    dropdownContainer: {
      width: '100%',
      display: 'flex',
      marginLeft: 0,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
      borderRadius: 30,
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 11,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
    },
    smallerText: {
      fontSize: 12,
    },
    dropdownIcon: {
      width: 15,
      height: 15,
    },
    dropdownlist: {
      position: 'absolute',
      borderRadius: 20,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
      top: 80,
      width: '100%',
      maxHeight: 60,
      alignSelf: 'center',
      overflow: 'hidden',
    },
    marginLeft: {
      marginLeft: 20,
    },
  });

export default DropdownSelector;
