import {render, screen, userEvent} from '@testing-library/react-native';
import React from 'react';
import {Button, Text, View} from 'react-native';
import AppStateProvider, {AppStatesContext} from './AppStateContext';

const ConsumerComponent = () => {
  const {isLoading, setIsLoading, blockingEnabled, setBlockingEnabled} =
    React.useContext(AppStatesContext);

  return (
    <View>
      <Text>isLoading: {isLoading.toString()}</Text>
      <Text>blockingEnabled: {blockingEnabled.toString()}</Text>
      <Button onPress={() => setIsLoading(!isLoading)} title="Toggle Loading" />
      <Button
        onPress={() => setBlockingEnabled(!blockingEnabled)}
        title="Toggle Blocking"
      />
    </View>
  );
};

describe('AppStateProvider', () => {
  it('should provide default values', () => {
    render(
      <AppStateProvider>
        <ConsumerComponent />
      </AppStateProvider>,
    );

    expect(screen.getByText('isLoading: true')).toBeTruthy();
    expect(screen.getByText('blockingEnabled: false')).toBeTruthy();
  });

  it('should toggle isLoading and blockingEnabled values', async () => {
    const user = userEvent.setup();

    render(
      <AppStateProvider>
        <ConsumerComponent />
      </AppStateProvider>,
    );

    const toggleLoadingBtn = screen.getByText('Toggle Loading');
    const toggleBlockingBtn = screen.getByText('Toggle Blocking');

    await user.press(toggleLoadingBtn);
    await user.press(toggleBlockingBtn);

    expect(screen.getByText('isLoading: false')).toBeTruthy();
    expect(screen.getByText('blockingEnabled: true')).toBeTruthy();
  });
});
