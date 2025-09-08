import EllipticButton from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import Separator from 'components/ui/Separator';
import {FormatUtils} from 'hive-keychain-commons';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {Token} from 'src/interfaces/tokens.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {spacingStyle} from 'src/styles/spacing';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';

type Props = {
  estimateId: string;
  slippage: number;
  amount: string;
  startToken: Token;
  endToken: Token;
  processSwap: (estimateId: string) => Promise<void>;
  estimate: string;
};

const SwapConfirm = ({
  estimateId,
  slippage,
  amount,
  startToken,
  endToken,
  processSwap,
  estimate,
}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  const [loading, setLoading] = useState(false);

  return (
    <Background theme={theme}>
      <View style={{flexGrow: 1, paddingBottom: 16, paddingTop: 60}}>
        <Caption
          text="wallet.operations.swap.swap_token_confirm_message"
          hideSeparator
        />
        <View
          style={[
            getCardStyle(theme).defaultCardItem,
            {marginHorizontal: 16, marginBottom: 0},
          ]}>
          <View style={styles.flexRowbetween}>
            <Text style={[styles.textBase]}>
              {translate('wallet.operations.swap.swap_id_title')}
            </Text>
            <Text style={[styles.textBase]}>
              {FormatUtils.shortenString(estimateId, 8)}
            </Text>
          </View>
          <Separator
            drawLine
            height={0.5}
            additionalLineStyle={styles.bottomLine}
          />
          <Separator height={10} />
          <View style={styles.flexRowbetween}>
            <Text style={[styles.textBase]}>
              {translate('wallet.operations.swap.estimation')}
            </Text>
            <View style={styles.flexRowbetween}>
              <Text style={[styles.textBase]}>
                {`${withCommas(amount)} ${startToken.symbol}`}
              </Text>
              <Icon
                name={Icons.ARROW_RIGHT_BROWSER}
                additionalContainerStyle={{marginHorizontal: 8}}
                width={20}
                height={20}
              />
              <Text style={[styles.textBase]}>{`${withCommas(estimate)} ${
                endToken.symbol
              }`}</Text>
            </View>
          </View>
          <Separator
            drawLine
            height={0.5}
            additionalLineStyle={styles.bottomLine}
          />
          <Separator height={10} />
          <View style={styles.flexRowbetween}>
            <Text style={[styles.textBase]}>
              {translate('wallet.operations.swap.slippage')}
            </Text>
            <Text style={[styles.textBase]}>{slippage}%</Text>
          </View>
        </View>
        <View style={spacingStyle.fillSpace} />
        <EllipticButton
          title={translate('common.confirm')}
          preventDoublons
          onPress={async () => {
            setLoading(true);
            try {
              await processSwap(estimateId);
            } finally {
              setLoading(false);
            }
          }}
          isLoading={loading}
          isWarningButton
        />
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRowbetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bottomLine: {
      borderColor: getColors(theme).lineSeparatorStroke,
      marginBottom: 20,
    },
    textBase: {
      color: getColors(theme).secondaryText,
    },
  });

export default SwapConfirm;
