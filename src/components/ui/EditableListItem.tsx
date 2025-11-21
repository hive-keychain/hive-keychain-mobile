import React, {ReactNode, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle, getSeparatorLineStyle} from 'src/styles/line';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {getRotateStyle} from 'src/styles/transform';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
  title_secondary_body_3,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import OperationInput from '../form/OperationInput';
import Icon from '../hive/Icon';
import ConfirmationInItem from './ConfirmationInItem';
import Separator from './Separator';

interface EditableListItemProps {
  label: string | ReactNode;
  value: string | ReactNode;
  isEditable?: boolean;
  onEdit?: (editedValue: string) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  initialEditValue?: string;
  deleteConfirmationTitleKey?: string;
  renderEditInput?: () => ReactNode;
  maxValue?: string;
  onMaxPress?: () => void;
  additionalLabelStyle?: any;
  additionalValueStyle?: any;
  subLabel?: string;
  subValue?: string;
}

const EditableListItem = ({
  label,
  value,
  isEditable = false,
  onEdit,
  onDelete,
  initialEditValue = '',
  deleteConfirmationTitleKey,
  renderEditInput,
  maxValue,
  onMaxPress,
  additionalLabelStyle,
  additionalValueStyle,
  subLabel,
  subValue,
}: EditableListItemProps) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);

  const [isExpanded, setIsExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedValue, setEditedValue] = useState(initialEditValue);
  const [isLoading, setIsLoading] = useState(false);

  // Update editedValue when initialEditValue changes
  useEffect(() => {
    if (!editMode) {
      setEditedValue(initialEditValue);
    }
  }, [initialEditValue, editMode]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Reset states when collapsing
    if (isExpanded) {
      setEditMode(false);
      setShowDeleteConfirmation(false);
      setEditedValue(initialEditValue);
    }
  };

  const handleEditPress = () => {
    setEditMode(true);
    setShowDeleteConfirmation(false);
    setEditedValue(initialEditValue);
  };

  const handleDeletePress = () => {
    setShowDeleteConfirmation(true);
    setEditMode(false);
  };

  const handleDeleteConfirm = async () => {
    if (onDelete) {
      setIsLoading(true);
      try {
        await onDelete();
      } finally {
        setIsLoading(false);
        setShowDeleteConfirmation(false);
        setIsExpanded(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleEditConfirm = async () => {
    if (onEdit) {
      setIsLoading(true);
      try {
        await onEdit(editedValue);
      } finally {
        setIsLoading(false);
        setEditMode(false);
        setIsExpanded(false);
        setEditedValue(initialEditValue);
      }
    }
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditedValue(initialEditValue);
  };

  const handleMaxPress = () => {
    if (onMaxPress) {
      onMaxPress();
    } else if (maxValue) {
      setEditedValue(maxValue);
    }
  };

  return (
    <View style={[getCardStyle(theme, 28).defaultCardItem]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleToggleExpand}
        style={styles.container}>
        <View style={styles.row}>
          {typeof label === 'string' ? (
            <Text style={[styles.textBase, additionalLabelStyle]}>{label}</Text>
          ) : (
            label
          )}
        </View>
        <View style={styles.rightContainer}>
          {typeof value === 'string' ? (
            <Text style={[styles.textBase, additionalValueStyle]}>{value}</Text>
          ) : (
            value
          )}
          {isEditable && (
            <Icon
              theme={theme}
              name={Icons.EXPAND}
              additionalContainerStyle={[
                styles.logo,
                getRotateStyle(isExpanded ? '0' : '180'),
              ]}
              {...styles.smallIcon}
              color={PRIMARY_RED_COLOR}
            />
          )}
        </View>
      </TouchableOpacity>
      {!showDeleteConfirmation && isExpanded && !editMode && isEditable && (
        <>
          {subLabel && subValue && (
            <View style={[styles.row, {justifyContent: 'space-between'}]}>
              <Text style={styles.textBase}>{subLabel}</Text>
              <Text style={styles.textBase}>{subValue}</Text>
            </View>
          )}
          <Separator
            drawLine
            additionalLineStyle={[
              getSeparatorLineStyle(theme, 0.5).itemLine,
              styles.margins,
            ]}
          />
          <View style={styles.buttonRowContainer}>
            {onEdit && (
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.button, styles.marginRight]}
                onPress={handleEditPress}>
                <Icon
                  name={Icons.EDIT}
                  theme={theme}
                  additionalContainerStyle={styles.roundButton}
                  {...styles.icon}
                  color={PRIMARY_RED_COLOR}
                />
                <Text style={styles.buttonText}>
                  {translate('common.edit')}
                </Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                activeOpacity={1}
                style={styles.button}
                onPress={handleDeletePress}>
                <Icon
                  name={Icons.REMOVE}
                  theme={theme}
                  additionalContainerStyle={styles.roundButton}
                  {...styles.icon}
                  color={PRIMARY_RED_COLOR}
                />
                <Text style={styles.buttonText}>
                  {translate('common.delete')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      {isExpanded && showDeleteConfirmation && !editMode && onDelete && (
        <>
          {subLabel && subValue && (
            <View style={[styles.row, {justifyContent: 'space-between'}]}>
              <Text style={styles.textBase}>{subLabel}</Text>
              <Text style={styles.textBase}>{subValue}</Text>
            </View>
          )}
          <Separator
            drawLine
            additionalLineStyle={[
              getSeparatorLineStyle(theme, 0.5).itemLine,
              styles.margins,
            ]}
          />
          <ConfirmationInItem
            theme={theme}
            titleKey={deleteConfirmationTitleKey}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isLoading={isLoading}
            additionalConfirmTextStyle={styles.whiteText}
          />
        </>
      )}
      {editMode && isExpanded && !showDeleteConfirmation && (
        <View style={[{alignSelf: 'center', width: '100%'}, styles.margins]}>
          {renderEditInput ? (
            renderEditInput()
          ) : (
            <OperationInput
              placeholder={'0.000'}
              keyboardType="decimal-pad"
              textAlign="right"
              value={editedValue}
              onChangeText={setEditedValue}
              additionalOuterContainerStyle={{
                width: '54%',
              }}
              rightIcon={
                maxValue ? (
                  <View style={styles.flexRowCenter}>
                    <Separator
                      drawLine
                      additionalLineStyle={getHorizontalLineStyle(
                        theme,
                        1,
                        35,
                        16,
                      )}
                    />
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={handleMaxPress}>
                      <Text style={[styles.textBase, styles.redText]}>
                        {translate('common.max').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : undefined
              }
            />
          )}
          {onEdit && (
            <View style={styles.editConfirmationPanel}>
              <ConfirmationInItem
                theme={theme}
                onCancel={handleEditCancel}
                onConfirm={handleEditConfirm}
                isLoading={isLoading}
                additionalConfirmTextStyle={styles.whiteText}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rightContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    editConfirmationPanel: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      marginTop: MARGIN_PADDING,
    },
    logo: {marginLeft: 10},
    textBase: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 12),
    },
    row: {flexDirection: 'row'},
    smallIcon: {width: 15, height: 15},
    buttonRowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    icon: {
      width: 18,
      height: 18,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '30%',
      borderRadius: 12,
      borderWidth: 1,
      justifyContent: 'center',
      paddingVertical: 10,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    buttonText: {
      color: getColors(theme).secondaryText,
      ...title_secondary_body_3,
      marginLeft: 8,
    },
    marginRight: {
      marginRight: 16,
    },
    roundButton: {
      width: 25,
      height: 25,
    },
    whiteText: {color: '#FFF'},
    margins: {marginTop: 10, marginBottom: 15},
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    redText: {color: PRIMARY_RED_COLOR},
  });

export default EditableListItem;
