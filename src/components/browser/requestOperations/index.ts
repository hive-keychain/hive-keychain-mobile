import AddAccount from './AddAccount';
import AddAccountAuthority from './AddAccountAuthority';
import Broadcast from './Broadcast';
import Custom from './Custom';
import Decode from './Decode';
import Delegation from './Delegation';
import Encode from './Encode';
import Post from './Post';
import PowerDown from './PowerDown';
import PowerUp from './PowerUp';
import Proxy from './Proxy';
import RemoveAccountAuthority from './RemoveAccountAuthority';
import SendToken from './SendToken';
import SignBuffer from './SignBuffer';
import SignTx from './SignTx';
import Transfer from './Transfer';
import UpdateProposalVote from './UpdateProposalVote';
import Vote from './Vote';
import WitnessVote from './Witness';

const map = {
  decode: Decode,
  signBuffer: SignBuffer,
  vote: Vote,
  custom: Custom,
  transfer: Transfer,
  post: Post,
  broadcast: Broadcast,
  witnessVote: WitnessVote,
  proxy: Proxy,
  powerUp: PowerUp,
  powerDown: PowerDown,
  delegation: Delegation,
  encode: Encode,
  signTx: SignTx,
  sendToken: SendToken,
  updateProposalVote: UpdateProposalVote,
  addAccount: AddAccount,
  addAccountAuthority: AddAccountAuthority,
  removeAccountAuthority: RemoveAccountAuthority,
};
export default map;
/*
Missing operations :
 Authority x4
 CreateAccount
 Create / Remove proposals
 Signed Calls
 Conversion
 Recurrent transfer
*/
