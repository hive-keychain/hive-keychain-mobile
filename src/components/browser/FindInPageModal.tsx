import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Icon from 'components/hive/Icon';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';
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
  const inputRef = useRef<TextInput>(null);
  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const styles = getStyles(theme, width, height, insets, isKeyboardVisible);

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
        behavior={'padding'}
        keyboardVerticalOffset={-insets.bottom}
        pointerEvents="box-none">
        <View style={styles.content} pointerEvents="auto">
          <View style={styles.inputContainer}>
            <TextInput
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
            />
            <Text style={styles.matchCount}>
              {localSearchText.length > 0
                ? matchCount > 0
                  ? `${currentMatch}/${matchCount}`
                  : '0/0'
                : '0/0'}
            </Text>
            <TouchableOpacity
              style={styles.caretButton}
              onPress={() => {
                if (matchCount > 1) {
                  inputRef.current?.blur();
                  onPrevious();
                }
              }}
              disabled={matchCount <= 1}>
              <MaterialIcons
                name="keyboard-arrow-up"
                size={20}
                color={
                  matchCount === 0 || localSearchText.length === 0
                    ? '#D3D3D3'
                    : getColors(theme).primaryText
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.caretButton}
              onPress={() => {
                if (matchCount > 1) {
                  inputRef.current?.blur();
                  onNext();
                }
              }}
              disabled={matchCount <= 1}>
              <View style={styles.rotatedIcon}>
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={20}
                  color={
                    matchCount === 0 || localSearchText.length === 0
                      ? '#D3D3D3'
                      : getColors(theme).primaryText
                  }
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Icon
                name={Icons.CLOSE_CIRCLE}
                theme={theme}
                width={20}
                height={20}
                color={getColors(theme).primaryText}
              />
            </TouchableOpacity>
          </View>
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
  isKeyboardVisible: boolean,
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
      flexGrow: 1,
    },
    container: {
      justifyContent: 'flex-end',
      flexShrink: 1,
    },
    content: {
      width: '100%',
      paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom / 2,
      backgroundColor: getColors(theme).cardBgColor,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: getColors(theme).cardBgColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      minHeight: 44,
    },
    input: {
      ...body_primary_body_1,
      color: getColors(theme).primaryText,
      flex: 1,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    matchCount: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
      minWidth: 36,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    caretButton: {
      padding: 10,
      minWidth: 36,
      minHeight: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rotatedIcon: {
      transform: [{rotate: '180deg'}],
    },
    closeButton: {
      padding: 10,
      minWidth: 36,
      minHeight: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default FindInPageModal;
