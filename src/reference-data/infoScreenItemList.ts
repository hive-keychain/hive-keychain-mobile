export type InfoScreenType = 'account_creation_peer_to_peer';

export interface InfoScreenData {
  name: InfoScreenType;
  titleKey: string;
  textContentKeyList: string[];
}

export const InfoScreenItemList: InfoScreenData[] = [
  {
    name: 'account_creation_peer_to_peer',
    titleKey: 'components.accountCreationPeerToPeer.title',
    textContentKeyList: [
      'components.accountCreationPeerToPeer.text1',
      'components.accountCreationPeerToPeer.text2',
      'components.accountCreationPeerToPeer.text3',
      'components.accountCreationPeerToPeer.text4',
    ],
  },
];
