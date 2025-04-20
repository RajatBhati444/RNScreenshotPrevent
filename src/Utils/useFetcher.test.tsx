import {renderHook, act} from '@testing-library/react-hooks';
import useFetcher from './useFetcher';
import {API_BASE_URL} from '../constants/apiConfig';

const mockEventData = {
  androidId: '1234567890abcdef',
  deviceManufacturer: 'Google',
  deviceName: 'Pixel 7',
  androidVersion: '13',
  location: {
    longitude: 77.1025,
    latitude: 28.7041,
  },
};

const mockResponseData = {
  success: true,
  message: 'Data received',
};

describe('useFetcher hook', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully with mock event payload', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResponseData,
    });

    const {result} = renderHook(() => useFetcher<typeof mockResponseData>());

    const payload = {
      ...mockEventData,
      OS: 'android',
      eventType: 'screenshot_blocking_enabled',
      timeStamp: new Date().toISOString(),
    };

    await act(async () => {
      await result.current.fetchData(`${API_BASE_URL}/api/vi/screenshotEvent`, {
        body: JSON.stringify(payload),
      });
    });

    // ✅ Flexible body check
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/vi/screenshotEvent`,
      expect.objectContaining({
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: expect.any(String),
      }),
    );

    // ✅ Optional: parse body and match object
    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    const parsedBody = JSON.parse(callArgs[1].body);

    expect(parsedBody).toMatchObject({
      ...mockEventData,
      OS: 'android',
      eventType: 'screenshot_blocking_enabled',
    });

    expect(result.current.data).toEqual(mockResponseData);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    const {result} = renderHook(() => useFetcher());

    await act(async () => {
      await result.current.fetchData(`${API_BASE_URL}/api/vi/screenshotEvent`);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network Error');
    expect(result.current.isLoading).toBe(false);
  });
});
