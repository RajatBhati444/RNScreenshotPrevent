import {useCallback, useContext, useEffect} from 'react';
import {NativeModules, NativeEventEmitter, Platform, Alert} from 'react-native';
import useFetcher from '../../../Utils/useFetcher';
import {AppStatesContext} from '../../../AppState/AppStateContext';
import {API_BASE_URL} from '../../../constants/apiConfig';

const {ScreenshotPrevent} = NativeModules;
const screenshotPreventEmitter = new NativeEventEmitter(ScreenshotPrevent);

interface EventDataType {
  androidId?: string;
  deviceManufacturer?: string;
  deviceName?: string;
  androidVersion?: string;
  location?: {
    longitude?: number;
    latitude?: number;
  };
}

function useScreenshotActionListeners() {
  const {setBlockingEnabled} = useContext(AppStatesContext);
  const {fetchData: eventDataFetcher, isLoading, error} = useFetcher();

  const sendEventData = useCallback(
    async (
      eventType: 'screenshot_blocking_enabled' | 'screenshot_blocking_disabled',
      _eventData: EventDataType,
      message: string,
    ) => {
      if (!_eventData) {
        return;
      }
      try {
        const {
          androidId,
          deviceManufacturer,
          deviceName,
          androidVersion,
          location: {longitude, latitude} = {},
        } = _eventData || {};

        await eventDataFetcher(`${API_BASE_URL}/api/vi/screenshotEvent`, {
          method: 'POST',
          body: JSON.stringify({
            OS: Platform.OS,
            location: {longitude, latitude},
            androidId,
            deviceManufacturer,
            deviceName,
            androidVersion,
            timeStamp: new Date().toISOString(),
            eventType,
          }),
        });

        if (!error) {
          Alert.alert(message);
        }
      } catch (err) {
        console.error('Error sending data', err);
      }
    },
    [error, eventDataFetcher],
  );

  useEffect(() => {
    if (!screenshotPreventEmitter) {
      console.error('ScreenshotPrevent module is not linked or unavailable.');
      return;
    }

    //->>>>  📸 Screenshot blocking has been enabled',  Listener for when screenshot blocking is enabled, This will be triggered when the user enables the screenshot blocking
    const enableListener = screenshotPreventEmitter.addListener(
      'onScreenshotBlockingEnabled',
      _eventData => {
        setBlockingEnabled(true);
        sendEventData(
          'screenshot_blocking_enabled',
          _eventData,
          '📸 Screenshot blocking has been enabled',
        );
      },
    );

    //->>>> '📸 Screenshot blocking has been disabled', Listener for when screenshot blocking is disabled. This will be triggered when the user disables the screenshot blocking
    const disableListener = screenshotPreventEmitter.addListener(
      'onScreenshotBlockingDisabled',
      _eventData => {
        setBlockingEnabled(false);
        sendEventData(
          'screenshot_blocking_disabled',
          _eventData,
          '📸 Screenshot blocking has been disabled',
        );
      },
    );

    return () => {
      enableListener.remove();
      disableListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDataFetcher, sendEventData]);
  return {
    isLoading,
  };
}

export default useScreenshotActionListeners;
