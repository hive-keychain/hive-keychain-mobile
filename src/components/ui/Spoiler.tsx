import Icon from 'components/hive/Icon';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';

type Props = {
  title: string;
  initiallyOpened?: boolean;
  children: React.ReactNode;
};
const Spoiler = ({title, initiallyOpened, children}: Props) => {
  const [isOpened, setIsOpened] = useState(initiallyOpened || false);
  const theme = useThemeContext().theme;
  const styles = getStyles(isOpened, theme);
  return (
    <View>
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          setIsOpened(!isOpened);
        }}>
        <Text style={styles.headerText}>{title}</Text>
        <Icon
          name={Icons.EXPAND_THIN}
          theme={theme}
          additionalContainerStyle={styles.expand}
          color={getColors(theme).primaryText}
          width={10}
          height={10}
        />
      </TouchableOpacity>
      <View style={styles.body}>{children}</View>
    </View>
  );
};

const getStyles = (isOpened: boolean, theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    headerText: {...title_primary_title_1, color: getColors(theme).primaryText},
    body: {display: isOpened ? 'flex' : 'none'},
    expand: {
      transform: isOpened ? [{rotateX: '0deg'}] : [{rotateX: '180deg'}],
    },
  });

export default Spoiler;
