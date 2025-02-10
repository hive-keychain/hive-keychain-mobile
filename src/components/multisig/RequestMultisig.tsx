import CollapsibleData from 'components/browser/requestOperations/components/CollapsibleData';
import RequestItem from 'components/browser/requestOperations/components/RequestItem';
import RequestMessage from 'components/browser/requestOperations/components/RequestMessage';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import {useHasExpiration} from 'hooks/useHasExpiration';
import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {SignatureRequest, Signer} from 'src/interfaces/multisig.interface';
import {getButtonHeight, getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {getCaptionStyle} from 'src/styles/text';
import {title_primary_body_2} from 'src/styles/typography';
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
};

const RequestMultisig = ({
  request: {signer, signatureRequest, decodedTransaction, key},
  onForceCloseModal,
  approve,
  expiration,
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
        <RequestItem
          title={translate('request.item.username')}
          content={`@${signer}`}
        />
        <RequestItem title={translate('request.item.key')} content={key} />
        <RequestItem
          title={translate('request.item.initiator')}
          content={`@${signatureRequest.initiator}`}
        />
        <CollapsibleData
          title={translate('request.item.transaction')}
          content={JSON.stringify(decodedTransaction, undefined, 2)}
          hidden={translate('request.item.hidden_data')}
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

export default RequestMultisig;
