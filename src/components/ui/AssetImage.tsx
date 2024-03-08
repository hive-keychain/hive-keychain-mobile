import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Binance from 'src/assets/buy/binance.svg';
import GateioDark from 'src/assets/buy/dark/gateio.svg';
import HuobiDark from 'src/assets/buy/dark/huobi.svg';
import IonomyDark from 'src/assets/buy/dark/ionomy.svg';
import MexcDark from 'src/assets/buy/dark/mexc.svg';
import GateioLight from 'src/assets/buy/light/gateio.svg';
import HuobiLight from 'src/assets/buy/light/huobi.svg';
import IonomyLight from 'src/assets/buy/light/ionomy.svg';
import MexcLight from 'src/assets/buy/light/mexc.svg';
import Upbit from 'src/assets/buy/upbit.svg';
import TransakSVG from 'src/assets/new_UI/transak-logo-rounded.svg';
import {Theme} from 'src/context/theme.context';
import SvgContainer, {
  ContainerStylesProps,
  contentSVGProps,
} from './SvgContainer';

interface AssetImageprops {
  onClick?: () => void;
  nameImage: string;
  withoutSVGContainer?: boolean;
  containerStyles?: ContainerStylesProps;
  theme: Theme;
}

const AssetImage = (props: AssetImageprops) => {
  const getImageFilePath = (fileName: string) => {
    let component;
    switch (fileName) {
      case 'binance':
        component = <Binance {...contentSVGProps} />;

        break;
      case 'transak':
        component = <TransakSVG {...contentSVGProps} />;

        break;
      case 'upbit':
        component = <Upbit {...contentSVGProps} />;

        break;
      case 'gateio':
        component =
          props.theme === Theme.DARK ? (
            <GateioDark {...contentSVGProps} />
          ) : (
            <GateioLight {...contentSVGProps} />
          );

        break;
      case 'ionomy':
        component =
          props.theme === Theme.DARK ? (
            <IonomyDark {...contentSVGProps} />
          ) : (
            <IonomyLight {...contentSVGProps} />
          );
        break;

      case 'huobi':
        component =
          props.theme === Theme.DARK ? (
            <HuobiDark {...contentSVGProps} />
          ) : (
            <HuobiLight {...contentSVGProps} />
          );
        break;
      case 'mexc':
        component =
          props.theme === Theme.DARK ? (
            <MexcDark {...contentSVGProps} />
          ) : (
            <MexcLight {...contentSVGProps} />
          );
        break;
    }
    return props.withoutSVGContainer ? (
      component
    ) : (
      <SvgContainer
        containerStyles={props.containerStyles}
        svgFile={component}
      />
    );
  };

  return props.onClick ? (
    <TouchableOpacity onPress={props.onClick}>
      {getImageFilePath(props.nameImage)}
    </TouchableOpacity>
  ) : (
    <>{getImageFilePath(props.nameImage)}</>
  );
};

export default AssetImage;
