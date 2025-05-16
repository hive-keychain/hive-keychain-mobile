import AddAccount from './AddAccount';
import AddAccountAuthority from './AddAccountAuthority';
import AddKeyAuthority from './AddKeyAuthority';
import Broadcast from './Broadcast';
import Convert from './Convert';
import CreateAccount from './CreateAccount';
import CreateProposal from './CreateProposal';
import Custom from './Custom';
import Decode from './Decode';
import Delegation from './Delegation';
import Encode from './Encode';
import Post from './Post';
import PowerDown from './PowerDown';
import PowerUp from './PowerUp';
import Proxy from './Proxy';
import RecurrentTransfer from './RecurrentTransfer';
import RemoveAccountAuthority from './RemoveAccountAuthority';
import RemoveKeyAuthority from './RemoveKeyAuthority';
import RemoveProposal from './RemoveProposal';
import SendToken from './SendToken';
import SignBuffer from './SignBuffer';
import SignTx from './SignTx';
import Transfer from './Transfer';
import UpdateProposalVote from './UpdateProposalVote';
import Vote from './Vote';
import VscDeposit from './VscDeposit';
import VscStaking from './VscStaking';
import VscTransfer from './VscTransfer';
import VscWithdrawal from './VscWithdrawal';
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
  addKeyAuthority: AddKeyAuthority,
  removeKeyAuthority: RemoveKeyAuthority,
  convert: Convert,
  recurrentTransfer: RecurrentTransfer,
  createClaimedAccount: CreateAccount,
  createProposal: CreateProposal,
  removeProposal: RemoveProposal,
  vscDeposit: VscDeposit,
  vscTransfer: VscTransfer,
  vscWithdrawal: VscWithdrawal,
  vscStaking: VscStaking,
};
export default map;
