import { KeyTypes } from "actions/interfaces";
import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import SimpleToast from "react-native-root-toast";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "store";
import { translate } from "utils/localize";
import EllipticButton from "./EllipticButton";

type Props = {
  method?: KeyTypes | "none";
  title: string;
  style: StyleProp<ViewStyle>;
  onPress: () => void;
  isLoading: boolean;
  additionalTextStyle?: StyleProp<TextStyle>;
} & PropsFromRedux;
const ActiveOperationButton = ({
  method,
  onPress,
  style,
  additionalTextStyle,
  ...props
}: Props) => {
  const disabled =
    method !== "none" && !props.user.keys[method || KeyTypes.active];
  return (
    <>
      <EllipticButton
        {...props}
        isWarningButton
        style={style}
        onPress={() => {
          if (disabled) {
            SimpleToast.show(
              translate(`wallet.add_${method || KeyTypes.active}`),
              {
                duration: SimpleToast.durations.LONG,
              }
            );
          } else {
            onPress();
          }
        }}
        additionalTextStyle={additionalTextStyle}
      />
    </>
  );
};

const connector = connect((state: RootState) => {
  return { user: state.activeAccount };
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ActiveOperationButton);
