import {ExchangesUtils} from 'hive-keychain-commons';
import {BuyCoinType} from 'src/enums/operations.enum';
import {getCurrency} from 'utils/hive';

interface Exchange {
  name: string;
  image: string;
  link: string;
  username: string;
  acceptedCoins: string[];
}

interface Platform {
  name: string;
  image: string;
  link: string;
  description: string;
}

interface BuyCoinsListItemInterface {
  list: Platform[];
  exchanges: Exchange[];
}

const exchanges = ExchangesUtils.getExchanges();
export const getBuyCoinsListItem = (
  type: BuyCoinType,
  username: string,
): BuyCoinsListItemInterface => {
  switch (type) {
    case BuyCoinType.BUY_HIVE:
      return {
        list: [
          // {
          //   name: 'Transak',
          //   image: 'transak.svg',
          //   link: `https://global.transak.com?apiKey=${TransakConfig.apiKey}&defaultCryptoCurrency=HIVE&exchangeScreenTitle=Buy%20HIVEs&isFeeCalculationHidden=true&walletAddress=${username}`,
          //   description: 'html_popup_transak_description',
          // },
          // {
          //   name: 'Blocktrades',
          //   image: 'blocktrades.svg',
          //   link: `https://blocktrades.us/en/trade?affiliate_id=dfccdbcb-6093-4e4a-992d-689bf46e2523&input_coin_type=btc&output_coin_type=hive&output_coin_amount=10&receive_address=${username}`,
          //   description: 'html_popup_blocktrades_description',
          // },
        ],
        exchanges: exchanges.filter((exchange) =>
          exchange.acceptedCoins?.includes(getCurrency('HIVE')),
        ),
      };
    case BuyCoinType.BUY_HDB:
      return {
        list: [
          // {
          //   name: 'Blocktrades',
          //   image: 'blocktrades.svg',
          //   link: `https://blocktrades.us/en/trade?affiliate_id=dfccdbcb-6093-4e4a-992d-689bf46e2523&input_coin_type=btc&output_coin_type=hbd&output_coin_amount=10&receive_address=${username}`,
          //   description: 'html_popup_blocktrades_description',
          // },
        ],
        exchanges: exchanges.filter((exchange) =>
          exchange.acceptedCoins?.includes(getCurrency('HBD')),
        ),
      };
  }
};
