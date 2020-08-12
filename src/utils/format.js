export const withCommas = (nb, decimals = 3) =>
  parseFloat(nb)
    .toFixed(decimals)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const toHP = (vests, props) =>
  (parseFloat(vests) * parseFloat(props.total_vesting_fund_steem)) /
  parseFloat(props.total_vesting_shares);
