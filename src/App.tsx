import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Toggle from './Modules/ScreenshotPreventModule/Components/Toggle/Toggle';
import NativeRNScreenshotPrevent from '../specs/NativeRNScreenshotPrevent';

export const enable = () => {
  NativeRNScreenshotPrevent.enable();
};
export const disable = () => {
  NativeRNScreenshotPrevent.disable();
};

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Toggle />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  spacer: {
    height: 50,
  },
});

export default App;
