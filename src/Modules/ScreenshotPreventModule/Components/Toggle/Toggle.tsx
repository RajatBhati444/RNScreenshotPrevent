/* eslint-disable react-native/no-inline-styles */
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {images} from '../../../../Assets';
import NativeRNScreenshotPrevent from '../../../../../specs/NativeRNScreenshotPrevent';
import useFetcher from '../../../../Hooks/useFetcher';
import {disable, enable} from '../../../../App';

const {ScreenshotPrevent} = NativeModules;
const screenshotPreventEmitter = new NativeEventEmitter(ScreenshotPrevent);

function Toggle() {
  const [blockingEnabled, setBlockingEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  //->>>> fetcher to send data to the server, This is used to send data to the server when the screenshot blocking is enabled or disabled
  const {fetchData, isLoading} = useFetcher();

  let uniLoader = isLoading || loading;

  useEffect(() => {
    //->>>>  Listener for when screenshot blocking is enabled, This will be triggered when the user enables the screenshot blocking
    const enableListener = screenshotPreventEmitter.addListener(
      'onScreenshotBlockingEnabled',
      async _eventData => {
        console.log('📸 Screenshot blocking has been enabled');

        setBlockingEnabled(true);
        await fetchData(
          'https://67ffc606b72e9cfaf725dcba.mockapi.io/api/vi/screenshotEvent',
          {
            method: 'POST',
            //@ts-ignore
            body: {
              location: {
                longitude: _eventData.longitude,
                latitude: _eventData.latitude,
              },
              androidId: _eventData.androidId,
              deviceManufacturer: _eventData.deviceManufacturer,
              deviceName: _eventData.deviceName,
              androidVersion: _eventData.androidVersion,
              timeStamp: new Date().toISOString(),
              eventType: 'screenshot_blocking_enabled',
            },
          },
        )
          .then(() => {
            console.log('Data sent successfully');
          })
          .catch(err => {
            console.error('Error sending data', err);
          });
      },
    );

    //->>>> Listener for when screenshot blocking is disabled. This will be triggered when the user disables the screenshot blocking
    const disableListener = screenshotPreventEmitter.addListener(
      'onScreenshotBlockingDisabled',
      async _response => {
        console.log('📸 Screenshot blocking has been disabled', _response);
        await fetchData(
          'https://67ffc606b72e9cfaf725dcba.mockapi.io/api/vi/screenshotEvent',
          {
            method: 'POST',
            //@ts-ignore
            body: {
              location: {
                longitude: _response.longitude,
                latitude: _response.latitude,
              },
              androidId: _response.androidId,
              deviceManufacturer: _response.deviceManufacturer,
              deviceName: _response.deviceName,
              androidVersion: _response.androidVersion,
              timeStamp: new Date().toISOString(),
              eventType: 'screenshot_blocking_disabled',
            },
          },
        )
          .then(() => {
            console.log('Data sent successfully');
          })
          .catch(err => {
            console.error('Error sending data', err);
          });

        setBlockingEnabled(false);
      },
    );

    return () => {
      enableListener.remove();
      disableListener.remove();
    };
  }, [fetchData]);

  //->>>> Function to check that screenshot blocking is enabled or disabled
  //->>>> This function will be called when the component mounts
  const checkEnabled = useMemo(() => {
    return async () => {
      try {
        const isEnabled = await NativeRNScreenshotPrevent.isEnabled();
        console.log('Screenshot blocking is enabled:', isEnabled);
        //->>>> Perform any action if the feature is enabled
        if (isEnabled) {
          setBlockingEnabled(true);
        } else {
          //->>>> Perform any action if the feature is disabled
          setBlockingEnabled(false);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error checking screenshot blocking status:', error);
      }
    };
  }, []);

  useEffect(() => {
    checkEnabled();
  }, [checkEnabled]);

  return (
    <View style={styles.toggleWrapper}>
      {!uniLoader && (
        <Fragment>
          {!blockingEnabled && (
            <Image
              source={images.enabledScreenShot}
              style={styles.mainIconStyle}
            />
          )}
          {blockingEnabled && (
            <Image
              source={images.disabledScreenShot}
              style={styles.mainIconStyle}
            />
          )}
        </Fragment>
      )}
      {uniLoader && (
        <ActivityIndicator
          color={'#4285f4'}
          size={'large'}
          style={styles.mainIconStyle}
        />
      )}

      <TouchableHighlight
        onPress={() => {
          blockingEnabled ? disable() : enable();
        }}
        style={styles.touchableStyle}
        disabled={uniLoader}
        underlayColor={'#4285f4'}>
        <View
          style={[
            styles.buttonView,
            {backgroundColor: blockingEnabled ? '#cccccc' : '#4285f4'},
          ]}>
          <View style={styles.iconWrapper}>
            <Image
              style={styles.iconStyle}
              source={blockingEnabled ? images.disabled : images.enabled}
            />
          </View>
          <Text
            style={[
              styles.textStyle,
              {color: !blockingEnabled ? 'white' : 'black'},
            ]}>
            {blockingEnabled ? 'Deactivate' : 'Activate'}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}

export default Toggle;

const styles = StyleSheet.create({
  toggleWrapper: {alignItems: 'center', justifyContent: 'center'},
  buttonView: {
    backgroundColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 40,
    paddingHorizontal: 22,
  },
  mainIconStyle: {height: 120, width: 120, marginBottom: 70},
  iconStyle: {
    width: 12,
    height: 12,
  },
  iconWrapper: {
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  touchableStyle: {borderRadius: 40},
});
