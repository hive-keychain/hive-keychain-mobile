let toggleElement: string;

export const setToggleElement = (elt: string) => {
  toggleElement = elt;
};

export const getToggleElement = () =>
  toggleElement
    .replace('Primary', 'WalletScreen')
    .replace('Tokens', 'EngineWalletScreen');
