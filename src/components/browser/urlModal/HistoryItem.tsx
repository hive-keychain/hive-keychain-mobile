import {Page} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import FastImageComponent from 'components/ui/FastImage';
import React, {memo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';
import {SwipeableItemComponent} from './SwipeToDelete';

type Props = {
  data: Page;
  onSubmit: (url: string) => void;
  onDismiss?: () => void;
  theme: Theme;
  indexItem?: number;
  drag?: any;
  enabled?: boolean;
};
export default memo(
  ({
    data,
    onSubmit,
    onDismiss,
    theme,
    indexItem,
    drag,
    enabled = true,
  }: Props) => {
    const {name, url, icon} = data;
    const styles = getStyles(theme);
    const [isDragging, setIsDragging] = useState(false);
    return (
      <View style={styles.wrapper}>
        <SwipeableItemComponent
          onDismiss={onDismiss}
          enabled={enabled && !isDragging}
          draggable={!!drag}
          containerStyle={styles.card}>
          <TouchableOpacity
            activeOpacity={1}
            style={[getCardStyle(theme).defaultCardItem, {marginBottom: 0}]}
            onPress={() => onSubmit(url)}
            key={`${url}-${indexItem}`}>
            <View style={styles.itemWrapper}>
              <FastImageComponent style={styles.img} source={icon} />
              <View style={styles.text}>
                <Text style={[styles.textBase, styles.name]} numberOfLines={1}>
                  {name}
                </Text>
                <Text
                  style={[styles.textBase, styles.textLink]}
                  numberOfLines={1}>
                  {url}
                </Text>
              </View>
              {drag && (
                <TouchableOpacity
                  style={{paddingLeft: 10}}
                  onPressIn={(event) => {
                    drag(event);
                    setIsDragging(true);
                    setTimeout(() => setIsDragging(false), 1000);
                    event.stopPropagation();
                  }}>
                  <Icon
                    name={Icons.DRAG}
                    theme={theme}
                    width={20}
                    height={20}
                    color={getColors(theme).icon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </SwipeableItemComponent>
      </View>
    );
  },
);

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: 8,
      paddingHorizontal: 20,
    },
    itemWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {marginLeft: 10, flex: 1},
    name: {fontWeight: 'bold'},
    img: {width: 30, height: 30, borderRadius: 50},
    card: {
      paddingHorizontal: 8,
      borderRadius: 19,
      margin: 1,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
      fontSize: 14,
    },
    textLink: {
      fontSize: 10,
      opacity: 0.6,
    },
  });
