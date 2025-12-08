import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  title_primary_title_1,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSearch: (text: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  searchText: string;
  matchCount: number;
  currentMatch: number;
};

const FindInPageModal = ({
  isVisible,
  onClose,
  onSearch,
  onNext,
  onPrevious,
  searchText,
  matchCount,
  currentMatch,
}: Props) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, width, height, insets);
  const inputRef = useRef<TextInput>(null);
  const [localSearchText, setLocalSearchText] = useState(searchText);

  useEffect(() => {
    setLocalSearchText(searchText);
  }, [searchText]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isVisible]);

  const handleTextChange = (text: string) => {
    setLocalSearchText(text);
    onSearch(text);
  };

  const handleSubmitEditing = () => {
    // On iOS, when user presses the "Search" button on keyboard,
    // trigger the search if there's text
    if (localSearchText.trim().length > 0) {
      onSearch(localSearchText);
    }
  };

  const handleClose = () => {
    setLocalSearchText('');
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.spacer} pointerEvents="none" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom : 0}
        pointerEvents="box-none">
        <View
          style={[getCardStyle(theme).defaultCardItem, styles.content]}
          pointerEvents="auto">
          <View style={styles.header}>
            <Text style={styles.title}>
              {translate('browser.find_in_page')}
            </Text>
            <Icon
              name={Icons.CLOSE_CIRCLE}
              theme={theme}
              width={24}
              height={24}
              onPress={handleClose}
            />
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <OperationInput
                ref={inputRef}
                style={styles.input}
                value={localSearchText}
                onChangeText={handleTextChange}
                onSubmitEditing={handleSubmitEditing}
                placeholder={translate('browser.find_in_page_placeholder')}
                placeholderTextColor={getColors(theme).secondaryText}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                keyboardType={Platform.OS === 'ios' ? 'web-search' : 'default'}
                rightIcon={
                  localSearchText.length > 0 &&
                  matchCount > 1 && (
                    <View style={styles.inputActions}>
                      <View style={styles.rotatedIcon}>
                        <Icon
                          name={Icons.ARROW_RIGHT}
                          theme={theme}
                          width={20}
                          height={20}
                          onPress={() => {
                            inputRef.current?.blur();
                            onPrevious();
                          }}
                          additionalContainerStyle={styles.caretButton}
                        />
                      </View>
                      <Icon
                        name={Icons.ARROW_RIGHT}
                        theme={theme}
                        width={20}
                        height={20}
                        onPress={() => {
                          inputRef.current?.blur();
                          onNext();
                        }}
                        additionalContainerStyle={styles.caretButton}
                      />
                    </View>
                  )
                }
              />
            </View>
          </View>

          {localSearchText.length > 0 && (
            <View style={styles.matchInfo}>
              <Text style={styles.matchText}>
                {matchCount > 0
                  ? `${currentMatch} / ${matchCount}`
                  : translate('browser.find_in_page_no_matches')}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const getStyles = (
  theme: Theme,
  width: number,
  height: number,
  insets: EdgeInsets,
) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
    spacer: {
      flex: 1,
    },
    container: {
      justifyContent: 'flex-end',
    },
    content: {
      padding: 20,
      paddingBottom: Platform.OS === 'ios' ? insets.bottom + 20 : 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      ...title_primary_title_1,
      fontWeight: 'bold',
      color: getColors(theme).primaryText,
    },
    searchContainer: {
      marginBottom: 12,
    },
    inputWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      ...body_primary_body_1,
      color: getColors(theme).primaryText,
      backgroundColor: getColors(theme).cardBgLighter,

      paddingRight: 80,
      paddingLeft: 16,
      flex: 1,
    },
    inputActions: {
      position: 'absolute',
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    caretButton: {
      padding: 8,
      minWidth: 36,
      minHeight: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rotatedIcon: {
      transform: [{rotate: '180deg'}],
    },
    matchInfo: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    matchText: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
    },
  });

export default FindInPageModal;
