import {WalletNavigation} from 'navigators/MainDrawer.types';
import {useCallback, useEffect, useState} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import {WidgetUtils} from 'utils/widget.utils';

type WidgetCommand = {
  currency?: string;
  navigateTo?: string;
  configureWidgets?: boolean;
};

const hasCommandPayload = (command: WidgetCommand | null | undefined) =>
  !!command && Object.values(command).length >= 1;

export const useWalletWidgetCommands = (navigation: WalletNavigation) => {
  const [showWidgetConfiguration, setShowWidgetConfiguration] = useState(false);

  const handleWidgetCommand = useCallback(
    (command: WidgetCommand) => {
      if (command.currency === 'update_values_currency_list') {
        WidgetUtils.sendWidgetData('currency_list');
        return;
      }
      if (command.navigateTo) {
        navigation.navigate(command.navigateTo as never);
        return;
      }
      if (command.configureWidgets !== undefined) {
        setShowWidgetConfiguration(Boolean(command.configureWidgets));
      }
    },
    [navigation],
  );

  const readPendingWidgetCommand = useCallback(async () => {
    if (
      Platform.OS === 'ios' ||
      !NativeModules.WidgetBridge?.readAndClearPendingCommand
    ) {
      return;
    }
    try {
      const pending =
        await NativeModules.WidgetBridge.readAndClearPendingCommand();
      if (hasCommandPayload(pending)) {
        handleWidgetCommand(pending);
      }
    } catch {
      return;
    }
  }, [handleWidgetCommand]);

  useEffect(() => {
    if (Platform.OS === 'ios' || !NativeModules.WidgetBridge) {
      return;
    }

    const eventEmitter = new NativeEventEmitter(NativeModules.WidgetBridge);
    const eventListener = eventEmitter.addListener(
      'command_event',
      (event: WidgetCommand) => {
        if (hasCommandPayload(event)) {
          handleWidgetCommand(event);
        }
      },
    );

    readPendingWidgetCommand();

    return () => {
      eventListener.remove();
    };
  }, [handleWidgetCommand, readPendingWidgetCommand]);

  return {
    showWidgetConfiguration,
    setShowWidgetConfiguration,
    readPendingWidgetCommand,
  };
};
