const React = require('react');
const FlatList = require('react-native').FlatList;

const DraggableFlatList = React.forwardRef((props, ref) => {
  return React.createElement(FlatList, {...props, ref});
});
DraggableFlatList.displayName = 'DraggableFlatList';

module.exports = {
  __esModule: true,
  default: DraggableFlatList,
  DragEndParams: {},
};
