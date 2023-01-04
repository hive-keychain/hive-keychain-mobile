import FloatingCloseButton from 'components/ui/FloatingCloseButton';
import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
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
      {filterValue.length > 0 && (
        <FloatingCloseButton
          style={styles.touchableItem}
          ariaLabel={'clear-filter-button'}
          onPressHandler={() => setFilterValue('')}
        />
      )}
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
    marginTop: 10,
  },
  customInputStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    // marginLeft: 4,
    padding: 6,
  },
  touchableItem: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
});

export default TokensHistoryFilterPanel;
