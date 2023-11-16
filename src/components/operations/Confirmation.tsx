import Background from 'components/ui/Background';
import {BackgroundHexagons} from 'components/ui/BackgroundHexagons';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
//TODO remove component after working with operations.
export interface ConfirmationOperationProps {
  titleOperationTrKey: string;
  childrenTop: JSX.Element;
  childrenBottom: JSX.Element;
}

const Confirmation = ({
  titleOperationTrKey,
  childrenBottom,
  childrenTop,
}: ConfirmationOperationProps) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <Background
      using_new_ui
      theme={theme}
      additionalBgSvgImageStyle={styles.backgroundSvgImage}>
      <>
        <FocusAwareStatusBar />
        <Separator height={50} />
        <View style={styles.contentContainer}>
          <BackgroundHexagons theme={theme} />
          <ScrollView>
            <Separator height={35} />
            {childrenTop}
          </ScrollView>
          {childrenBottom}
        </View>
      </>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    backgroundSvgImage: {
      top: theme === Theme.LIGHT ? -80 : 0,
      opacity: 1,
    },
    contentContainer: {
      flex: 1,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorJustDark,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
    },
  });

export default Confirmation;
