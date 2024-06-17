import React from 'react';
import {Text, TextStyle, useWindowDimensions} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getCaptionStyle} from 'src/styles/text';
import {translate} from 'utils/localize';
import Separator from './Separator';

interface CaptionProps {
  text: string;
  textParams?: any;
  additionnalText?: string;
  additionnalTextParams?: any;
  hideSeparator?: boolean;
  additionnalTextStyle?: TextStyle;
  additionnalTextOnClick?: () => void;
  skipTranslation?: boolean;
  justify?: boolean;
  skipFirstTextLine?: boolean;
  separatorHeight?: number;
}

export const Caption = ({
  text,
  textParams,
  additionnalText,
  additionnalTextParams,
  hideSeparator = false,
  additionnalTextStyle,
  additionnalTextOnClick,
  skipTranslation,
  justify,
  skipFirstTextLine,
  separatorHeight,
}: CaptionProps) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();

  const handleAdditionnalTextOnClick = () => {
    if (additionnalTextOnClick) additionnalTextOnClick();
  };

  return (
    <>
      {!skipFirstTextLine && (
        <Text
          style={[
            getCaptionStyle(width, theme),
            justify ? {textAlign: 'justify'} : undefined,
          ]}>
          {skipTranslation ? text : translate(text, textParams)}
        </Text>
      )}
      {additionnalText && (
        <Text
          style={[
            getCaptionStyle(width, theme),
            {marginTop: 8},
            additionnalTextStyle,
          ]}
          onPress={handleAdditionnalTextOnClick}>
          {translate(additionnalText, additionnalTextParams)}
        </Text>
      )}
      {
        <Separator
          height={separatorHeight}
          drawLine={!hideSeparator}
          additionalLineStyle={{
            borderColor: getColors(theme).cardBorderColor,
          }}
        />
      }
    </>
  );
};
