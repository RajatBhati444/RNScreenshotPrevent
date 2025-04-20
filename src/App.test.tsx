import React from 'react';
import {render} from '@testing-library/react-native';
import App from './App';
import Toggle from './Modules/ScreenshotPreventModule/Components/Toggle/Toggle';

jest.mock('./Modules/ScreenshotPreventModule/Components/Toggle/Toggle', () =>
  jest.fn(() => {
    return <></>; // Mocking Toggle component
  }),
);

describe('App Component', () => {
  it('should render without crashing', () => {
    const {getByTestId} = render(<App />);
    expect(getByTestId('app-safe-area')).toBeTruthy();
  });

  it('should include the Toggle component', () => {
    render(<App />);
    expect(Toggle).toHaveBeenCalled();
  });
});
