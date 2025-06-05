import {Page} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
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
export default ({
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

  return (
    <View style={styles.wrapper}>
      <SwipeableItemComponent
        onDismiss={onDismiss}
        enabled={enabled}
        containerStyle={styles.card}>
        <TouchableOpacity
          activeOpacity={1}
          style={[getCardStyle(theme).defaultCardItem, {marginBottom: 0}]}
          onPress={() => onSubmit(url)}
          key={`${url}-${indexItem}`}>
          <View style={styles.itemWrapper}>
            <Image style={styles.img} source={{uri: icon}} />
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
              <TouchableOpacity onPressIn={drag}>
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
};

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
