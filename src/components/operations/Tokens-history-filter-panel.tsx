import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {translate} from 'utils/localize';

type TokensHistoryFilterPanelProps = {
  loading: boolean;
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
};

const TokensHistoryFilterPanel = ({
  loading,
  filterValue,
  setFilterValue,
}: TokensHistoryFilterPanelProps) => {
  return !loading ? (
    <View style={styles.rowContainerSpaceBetween}>
      <TextInput
        style={styles.customInputStyle}
        placeholder={translate('common.search_box_placeholder')}
        value={filterValue}
        onChangeText={setFilterValue}
      />
      <TouchableOpacity
        style={styles.touchableItem}
        aria-label="clear-filters"
        onPress={() => setFilterValue('')}>
        <Text>clear</Text>
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  rowContainerSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customInputStyle: {
    width: '72%',
    height: 40,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    marginLeft: 4,
    padding: 6,
  },
  touchableItem: {
    borderColor: 'black',
    width: '20%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TokensHistoryFilterPanel;
