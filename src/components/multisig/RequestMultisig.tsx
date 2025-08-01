import RequestMessage from 'components/browser/requestOperations/components/RequestMessage';
import EllipticButton from 'components/form/EllipticButton';
import {ConfirmationDataTag} from 'components/operations/Confirmation';
import ConfirmationCard from 'components/operations/ConfirmationCard';
import Operation from 'components/operations/Operation';
import {useHasExpiration} from 'hooks/useHasExpiration';
import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {SignatureRequest, Signer} from 'src/interfaces/multisig.interface';
import {Token} from 'src/interfaces/tokens.interface';
import {getButtonHeight, getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {getCaptionStyle} from 'src/styles/text';
import {title_primary_body_2} from 'src/styles/typography';
import {RootState} from 'store';
import {Colors} from 'utils/colors';
import {translate} from 'utils/localize';

type Props = {
  onForceCloseModal?: () => void;
  approve: () => void;
  request: {
    decodedTransaction: any;
    signer: Signer;
    signatureRequest: SignatureRequest;
    key: string;
  };
  expiration?: number;
  tokens: Token[];
  colors: Colors;
};

const RequestMultisig = ({
  request: {signer, signatureRequest, decodedTransaction, key},
  onForceCloseModal,
  approve,
  expiration,
  tokens,
  colors,
}: Props) => {
  useHasExpiration(expiration);
  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles(theme, width);
  const renderOperationDetails = () => {
    return (
      <View>
        <RequestMessage
          message={translate('request.message.multisig')}
          additionalTextStyle={[
            getCaptionStyle(width, theme),
            {paddingHorizontal: 0, marginTop: 0},
          ]}
        />

        <ConfirmationCard
          data={[
            {
              title: 'request.item.username',
              value: `@${(signer + '').split(',')[0]}`,
              tag: ConfirmationDataTag.USERNAME,
            },
            {title: 'request.item.key', value: key},
            {
              title: 'request.item.initiator',
              value: `@${signatureRequest.initiator}`,
              tag: ConfirmationDataTag.USERNAME,
            },
            {
              title: 'request.item.transaction',
              value: JSON.stringify(decodedTransaction, undefined, 2),
              tag: ConfirmationDataTag.COLLAPSIBLE,
              hidden: translate('request.item.hidden_data'),
            },
          ]}
          tokens={tokens}
          colors={colors}
        />
        <EllipticButton
          style={[getButtonStyle(theme).warningStyleButton, styles.button]}
          additionalTextStyle={[styles.text, styles.whiteText]}
          title={translate('request.confirm')}
          isLoading={false}
          onPress={approve}
        />
      </View>
    );
  };

  return (
    <Operation
      title={translate('request.title.multisig')}
      onClose={onForceCloseModal}>
      {renderOperationDetails()}
    </Operation>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    text: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    button: {marginTop: 16, marginBottom: 16, height: getButtonHeight(width)},
    whiteText: {color: '#FFF'},
  });
const connector = connect((state: RootState) => ({
  tokens: state.tokens,
  colors: state.colors,
}));
type TypesFromRedux = ConnectedProps<typeof connector>;
export default connector(RequestMultisig);
