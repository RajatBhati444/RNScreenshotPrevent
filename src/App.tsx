import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Toggle from './Modules/ScreenshotPreventModule/Components/Toggle/Toggle';
import AppStateProvider from './AppState/AppStateContext';
import colors from './constants/colors';

function App(): React.JSX.Element {
  return (
    <AppStateProvider>
      <SafeAreaView style={styles.container} testID="app-safe-area">
        <Toggle />
      </SafeAreaView>
    </AppStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.white,
  },
  spacer: {
    height: 50,
  },
});

export default App;
