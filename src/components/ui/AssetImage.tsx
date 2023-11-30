import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BinanceSVG from 'src/assets/images/binance.svg';
import BlocktradesSVG from 'src/assets/images/blocktrades.svg';
import Cryptex24SVG from 'src/assets/images/cryptex24.svg';
import GateioSVG from 'src/assets/images/gateio.svg';
import HuobiSVG from 'src/assets/images/huobi.svg';
import IonomySVG from 'src/assets/images/ionomy.svg';
import MexcSVG from 'src/assets/images/mexc.svg';
import ProbitSVG from 'src/assets/images/probit.svg';
import UpbitSVG from 'src/assets/images/upbit.svg';
import TransakSVG from 'src/assets/new_UI/transak-logo-rounded.svg';
import SvgContainer, {
  ContainerStylesProps,
  contentSVGProps,
} from './SvgContainer';

interface AssetImageprops {
  onClick?: () => void;
  nameImage: string;
  withoutSVGContainer?: boolean;
  containerStyles?: ContainerStylesProps;
}

const AssetImage = (props: AssetImageprops) => {
  const getImageFilePath = (fileName: string) => {
    switch (fileName) {
      case 'binance':
        return props.withoutSVGContainer ? (
          <BinanceSVG {...contentSVGProps} />
        ) : (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<BinanceSVG {...contentSVGProps} />}
          />
        );
      case 'blocktrades':
        return props.withoutSVGContainer ? (
          <BlocktradesSVG {...contentSVGProps} />
        ) : (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<BlocktradesSVG {...contentSVGProps} />}
          />
        );
      case 'transak':
        return props.withoutSVGContainer ? (
          <TransakSVG {...contentSVGProps} />
        ) : (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<TransakSVG {...contentSVGProps} />}
          />
        );
      //TODO complete bellow if needed
      case 'upbit':
        return (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<UpbitSVG {...contentSVGProps} />}
          />
        );
      case 'gateio':
        return (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<GateioSVG {...contentSVGProps} />}
          />
        );
      case 'ionomy':
        return (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<IonomySVG {...contentSVGProps} />}
          />
        );
      case 'huobi':
        return (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<HuobiSVG {...contentSVGProps} />}
          />
        );
      case 'mexc':
        return (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<MexcSVG {...contentSVGProps} />}
          />
        );
      case 'probit':
        return (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<ProbitSVG {...contentSVGProps} />}
          />
        );
      case 'cryptex24':
        return (
          <SvgContainer
            containerStyles={props.containerStyles}
            svgFile={<Cryptex24SVG {...contentSVGProps} />}
          />
        );
      default:
        console.log('Please check as not found image svg!');
        return null;
    }
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
