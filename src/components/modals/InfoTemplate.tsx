import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  InfoScreenData,
  InfoScreenItemList,
  InfoScreenType,
} from 'src/lists/infoScreenItemList';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_small,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

interface Props {
  info: InfoScreenType;
  skipTranslation?: boolean;
}

export default ({skipTranslation, info}: Props) => {
  const [contentData, setContentData] = useState<InfoScreenData>(
    InfoScreenItemList.find((i) => i.name === info)!,
  );
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);

  const renderText = (textOrKey: string) => {
    return skipTranslation ? textOrKey : translate(textOrKey);
  };

  return (
    <SafeArea skipTop>
      <Text style={styles.h4}>{renderText(contentData.titleKey)}</Text>
      <Separator />
      <>
        {contentData.textContentKeyList.map((t, index) => {
          return (
            <Text key={`${t}-${index}`} style={styles.textContent}>
              {renderText(t)}
            </Text>
          );
        })}
      </>
      <Separator />
    </SafeArea>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    h4: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        headlines_primary_headline_2.fontSize,
      ),
    },
    textContent: {
      ...button_link_primary_small,
      color: getColors(theme).secondaryText,
    },
  });
