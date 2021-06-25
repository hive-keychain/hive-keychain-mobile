import Broadcast from './Broadcast';
import Custom from './Custom';
import Decode from './Decode';
import Delegation from './Delegation';
import Encode from './Encode';
import Post from './Post';
import PowerDown from './PowerDown';
import PowerUp from './PowerUp';
import Proxy from './Proxy';
import SendToken from './SendToken';
import SignBuffer from './SignBuffer';
import SignTx from './SignTx';
import Transfer from './Transfer';
import UpdateProposalVote from './UpdateProposalVote';
import Vote from './Vote';
import WitnessVote from './Witness';

export default {
  Decode,
  SignBuffer,
  Vote,
  Custom,
  Transfer,
  Post,
  Broadcast,
  WitnessVote,
  Proxy,
  PowerUp,
  PowerDown,
  Delegation,
  Encode,
  SignTx,
  SendToken,
  UpdateProposalVote,
};

/*
Missing operations :
 AddAccounts
 Authority x4
 CreateAccount
 Create / Remove proposals
 Signed Calls
 Conversion
 Recurrent transfer
*/
