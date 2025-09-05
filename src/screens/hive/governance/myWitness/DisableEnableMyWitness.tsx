import ActiveOperationButton from "components/form/ActiveOperationButton";
import EllipticButton from "components/form/EllipticButton";
import Background from "components/ui/Background";
import FocusAwareStatusBar from "components/ui/FocusAwareStatusBar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SimpleToast from "react-native-root-toast";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { ConnectedProps, connect } from "react-redux";
import { Theme } from "src/context/theme.context";
import { WitnessParamsForm } from "src/interfaces/witness.interface";
import { getButtonStyle } from "src/styles/button";
import { BACKGROUNDDARKBLUE, getColors } from "src/styles/colors";
import {
  body_primary_body_3,
  button_link_primary_medium,
} from "src/styles/typography";
import { RootState } from "store";
import { translate } from "utils/localize";
import { goBack } from "utils/navigation";
import {
  WITNESS_DISABLED_KEY,
  getLastSigningKeyForWitness,
  saveLastSigningKeyForWitness,
  updateWitnessParameters,
} from "utils/witness.utils";

interface Props {
  mode: "enable" | "disable";
  theme: Theme;
  witnessInfo: any;
}

const DisableEnableMyWitness = ({
  mode,
  theme,
  witnessInfo,
  user,
}: Props & PropsFromRedux) => {
  const [loading, setLoading] = useState(false);
  const [lastSigningKey, setLastSigningKey] = useState<string | null>(null);
  const styles = getStyles(theme);

  useEffect(() => {
    initLastSigningKey();
  }, []);

  const initLastSigningKey = async () => {
    const read = await getLastSigningKeyForWitness(user.name!);
    setLastSigningKey(read);
  };

  const updateWitness = async () => {
    try {
      await saveLastSigningKeyForWitness(user.name!, witnessInfo.signingKey);
      const success = await updateWitnessParameters(
        user.name!,
        {
          accountCreationFee: witnessInfo.params.accountCreationFee,
          maximumBlockSize: witnessInfo.params.maximumBlockSize,
          hbdInterestRate: witnessInfo.params.hbdInterestRate,
          signingKey:
            mode === "disable" ? WITNESS_DISABLED_KEY : lastSigningKey,
          url: witnessInfo.url,
        } as WitnessParamsForm,
        user.keys.active!
      );
      if (success) {
        SimpleToast.show(
          translate("governance.my_witness.success_witness_account_update"),
          {
            duration: SimpleToast.durations.LONG,
          }
        );
      } else {
        SimpleToast.show(
          translate("toast.error_witness_account_update", {
            account: user.name!,
          }),
          {
            duration: SimpleToast.durations.LONG,
          }
        );
      }
      goBack();
    } catch (error) {
      console.log({ error });
      SimpleToast.show(error.message, {
        duration: SimpleToast.durations.LONG,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}
    >
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <Text style={[styles.title, styles.textOpaque]}>
          {translate(
            "governance.my_witness.enable_disable_witness_confirmation_info",
            { mode, owner: witnessInfo.username }
          )}
        </Text>
        <View style={styles.buttonsContainer}>
          <EllipticButton
            title={translate("common.back")}
            onPress={() => goBack()}
            style={[styles.operationButton, styles.operationButtonConfirmation]}
            additionalTextStyle={[
              styles.operationButtonText,
              styles.buttonTextColorDark,
            ]}
          />
          <ActiveOperationButton
            title={translate("common.confirm")}
            onPress={() => updateWitness()}
            style={[
              styles.operationButton,
              getButtonStyle(theme).warningStyleButton,
            ]}
            additionalTextStyle={styles.operationButtonText}
            isLoading={loading}
          />
        </View>
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingBottom: 10,
    },
    title: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_3,
      paddingHorizontal: 10,
    },
    textOpaque: { opacity: 0.7 },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    operationButton: {
      width: "48%",
      marginHorizontal: 0,
    },
    operationButtonConfirmation: {
      backgroundColor: "#FFF",
    },
    operationButtonText: {
      ...button_link_primary_medium,
    },
    buttonTextColorDark: {
      color: BACKGROUNDDARKBLUE,
    },
  });

const connector = connect((state: RootState) => {
  return { user: state.activeAccount };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DisableEnableMyWitness);
