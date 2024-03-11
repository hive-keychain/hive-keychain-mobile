import React from 'react';
import {Text, useWindowDimensions} from 'react-native';
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
}

export const Caption = ({
  text,
  textParams,
  additionnalText,
  additionnalTextParams,
  hideSeparator = false,
}: CaptionProps) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();

  return (
    <>
      <Text style={getCaptionStyle(width, theme)}>
        {translate(text, textParams)}
      </Text>
      {additionnalText && (
        <Text style={getCaptionStyle(width, theme)}>
          {translate(additionnalText, additionnalTextParams)}
        </Text>
      )}
      {
        <Separator
          drawLine={!hideSeparator}
          additionalLineStyle={{
            borderColor: getColors(theme).cardBorderColor,
          }}
        />
      }
    </>
  );
};
