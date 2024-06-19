import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  InfoScreenData,
  InfoScreenItemList,
  InfoScreenType,
} from 'src/reference-data/infoScreenItemList';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_small,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Height} from 'utils/common.types';
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
    <>
      <Text style={styles.h4}>{renderText(contentData.titleKey)}</Text>
      <Separator />
      {contentData.textContentKeyList.map((t, index) => {
        return (
          <Text key={`${t}-${index}`} style={styles.textContent}>
            {renderText(t)}
          </Text>
        );
      })}
    </>
  );
};

const getDimensionedStyles = ({height}: Height, theme: Theme) =>
  StyleSheet.create({
    h4: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
    },
    textContent: {
      ...button_link_primary_small,
      color: getColors(theme).secondaryText,
    },
  });
