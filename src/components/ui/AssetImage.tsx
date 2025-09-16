import React from 'react';
import {Pressable} from 'react-native';
import Binance from 'src/assets/images/buy/binance.svg';
import GateioDark from 'src/assets/images/buy/dark/gateio.svg';
import HuobiDark from 'src/assets/images/buy/dark/huobi.svg';
import IonomyDark from 'src/assets/images/buy/dark/ionomy.svg';
import MexcDark from 'src/assets/images/buy/dark/mexc.svg';
import GateioLight from 'src/assets/images/buy/light/gateio.svg';
import HuobiLight from 'src/assets/images/buy/light/huobi.svg';
import IonomyLight from 'src/assets/images/buy/light/ionomy.svg';
import MexcLight from 'src/assets/images/buy/light/mexc.svg';
import Upbit from 'src/assets/images/buy/upbit.svg';
import TransakSVG from 'src/assets/images/buy/transak-logo-rounded.svg';
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
    <Pressable onPress={props.onClick}>
      {getImageFilePath(props.nameImage)}
    </Pressable>
  ) : (
    <>{getImageFilePath(props.nameImage)}</>
  );
};

export default AssetImage;
