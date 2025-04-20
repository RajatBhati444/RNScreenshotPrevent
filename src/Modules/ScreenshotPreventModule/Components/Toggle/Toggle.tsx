import React, {useCallback, useContext} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {images} from '../../../../Assets';
import useGetPreventState from '../../Hooks/useGetPreventState';
import {AppStatesContext} from '../../../../AppState/AppStateContext';
import useScreenshotActionListeners from '../../Hooks/useScreenshotActionListeners';
import NativeRNScreenshotPrevent from '../../../../../specs/NativeRNScreenshotPrevent';
import colors from '../../../../constants/colors';

function Toggle() {
  useGetPreventState();
  const {isLoading: actionLoading} = useScreenshotActionListeners();
  const {isLoading, blockingEnabled} = useContext(AppStatesContext);

  const toggleScreenshot = useCallback(() => {
    if (blockingEnabled) {
      NativeRNScreenshotPrevent.disable();
    } else {
      NativeRNScreenshotPrevent.enable();
    }
  }, [blockingEnabled]);

  const buttonColor = blockingEnabled ? colors.lightGray : colors.primary;
  const buttonTextColor = blockingEnabled ? colors.text : colors.white;
  const buttonText = blockingEnabled ? 'Deactivate' : 'Activate';
  const iconSource = blockingEnabled ? images.disabled : images.enabled;
  const mainIconSource = blockingEnabled
    ? images.disabledScreenShot
    : images.enabledScreenShot;

  let loader = actionLoading || isLoading;

  return (
    <View style={styles.toggleWrapper}>
      {loader ? (
        <ActivityIndicator
          style={styles.mainIconStyle}
          color={colors.primary}
        />
      ) : (
        <Image source={mainIconSource} style={styles.mainIconStyle} />
      )}

      {/* Toggle button */}
      <TouchableHighlight
        onPress={toggleScreenshot}
        style={styles.touchableStyle}
        disabled={loader}
        underlayColor={colors.primary}>
        <View
          style={[
            styles.buttonView,
            {
              backgroundColor: buttonColor,
            },
          ]}>
          <View style={styles.iconWrapper}>
            <Image style={styles.iconStyle} source={iconSource} />
          </View>
          <Text style={[styles.textStyle, {color: buttonTextColor}]}>
            {buttonText}
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
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  touchableStyle: {borderRadius: 40, width: 150},
});
