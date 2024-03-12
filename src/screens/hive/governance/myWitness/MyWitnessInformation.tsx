import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
  fields_primary_text_2,
} from 'src/styles/typography';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import MyWitnessDataBlock from './MyWitnessDataBlock';

interface Props {
  theme: Theme;
  witnessInfo: any;
}

const MyWitnessInformation = ({theme, witnessInfo}: Props) => {
  const styles = getStyles(theme);
  return (
    <>
      <View style={styles.flexRowWrapped}>
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_amount_votes"
          value={witnessInfo.votesCount.toString()}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_votes"
          value={`${witnessInfo.voteValueInHP} ${getCurrency('HP')}`}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_blocks_missed"
          value={witnessInfo.blockMissed}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_last_block"
          value={witnessInfo.lastBlock}
          urlOnTitle={witnessInfo.lastBlockUrl}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_price_feed"
          value={witnessInfo.priceFeed}
          bottomValue={translate('governance.my_witness.information_updated', {
            updatedAt: witnessInfo.priceFeedUpdatedAt.fromNow(),
          })}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_version"
          value={witnessInfo.version}
        />
      </View>
      <Separator />
      <View style={[getCardStyle(theme).defaultCardItem, styles.marginBottom]}>
        <Text style={[styles.textBase, styles.textBold, styles.textCentered]}>
          {translate('governance.my_witness.information_reward')}
        </Text>
        <Separator height={8} />
        <View style={styles.flexRow}>
          <Text style={[styles.textBase, styles.textBold]}>
            {translate(
              'governance.my_witness.information_reward_panel_last_week',
            )}
          </Text>
          <Text style={[styles.textBase, styles.textBold]}>
            {witnessInfo.rewards.lastWeekInHP}
          </Text>
          <Text style={[styles.textBase, styles.smallText, styles.textOpaque]}>
            ≈ ${witnessInfo.rewards.lastWeekInUSD}
          </Text>
        </View>
        <View style={styles.flexRow}>
          <Text style={[styles.textBase, styles.textBold]}>
            {translate(
              'governance.my_witness.information_reward_panel_last_month',
            )}
          </Text>
          <Text style={[styles.textBase, styles.textBold]}>
            {witnessInfo.rewards.lastMonthInHP}
          </Text>
          <Text style={[styles.textBase, styles.smallText, styles.textOpaque]}>
            ≈ ${witnessInfo.rewards.lastMonthInUSD}
          </Text>
        </View>
      </View>
    </>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRowWrapped: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    textBold: {
      fontFamily: FontPoppinsName.BOLD,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    textCentered: {textAlign: 'center'},
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textOpaque: {opacity: 0.7},
    smallText: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_2,
    },
    marginBottom: {
      marginBottom: 15,
    },
  });

export default MyWitnessInformation;
