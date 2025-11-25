const React = require('react');
const View = require('react-native/Libraries/Components/View/View');
const FlatList = require('react-native').FlatList;
const ScrollView = require('react-native').ScrollView;

const createAnimatedComponent = (component) => {
  if (!component) {
    const DefaultComponent = React.forwardRef((props, ref) => {
      return React.createElement(View, {...props, ref});
    });
    DefaultComponent.displayName = 'Animated.Component';
    return DefaultComponent;
  }
  const AnimatedComponent = React.forwardRef((props, ref) => {
    return React.createElement(component, {...props, ref});
  });
  AnimatedComponent.displayName = `Animated.${component.displayName || component.name || 'Component'}`;
  return AnimatedComponent;
};

module.exports = {
  __esModule: true,
  default: {
    View: View,
    FlatList: FlatList,
    ScrollView: ScrollView,
    createAnimatedComponent,
  },
  View: View,
  FlatList: FlatList,
  ScrollView: ScrollView,
  createAnimatedComponent,
};
