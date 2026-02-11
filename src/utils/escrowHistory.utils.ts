import {EscrowHistoryMessage} from 'hive-keychain-commons';
import {translate} from 'utils/localize';

export const translateEscrowHistoryMessage = (
  message: EscrowHistoryMessage,
) => {
  return translate(
    `components.notifications.${message.key}`,
    Object.assign({}, message.params),
  );
};
