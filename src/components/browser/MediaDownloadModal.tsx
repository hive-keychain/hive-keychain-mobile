import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {translate} from 'utils/localize';

type Props = {
  onSave: () => void;
  onShare: () => void;
  onCancel: () => void;
};

const MediaDownloadModal = ({onSave, onShare, onCancel}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {translate('common.media_download_modal_title')}
      </Text>
      <Separator height={20} />
      <EllipticButton
        title={translate('common.save')}
        onPress={onSave}
        style={styles.button}
        isWarningButton
      />
      <Separator height={15} />
      <EllipticButton
        title={translate('common.share')}
        onPress={onShare}
        style={styles.button}
      />
      <Separator height={15} />
      <EllipticButton
        title={translate('common.cancel')}
        onPress={onCancel}
        style={styles.button}
      />
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      padding: 20,
      alignItems: 'center',
    },
    title: {
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      textAlign: 'center',
    },
    button: {
      width: '100%',
    },
  });

export default MediaDownloadModal;
