import {useContext, useEffect} from 'react';
import NativeRNScreenshotPrevent from '../../../../specs/NativeRNScreenshotPrevent';
import {AppStatesContext} from '../../../AppState/AppStateContext';

function useGetPreventState() {
  const {setBlockingEnabled, setIsLoading} = useContext(AppStatesContext);

  useEffect(() => {
    // Function to check if screenshot blocking is enabled
    const checkScreenshotStatus = async () => {
      try {
        // Checking if screenshot blocking is enabled
        const isEnabled = await NativeRNScreenshotPrevent.isEnabled();
        console.log('Screenshot blocking is enabled:', isEnabled);

        // Updating the context state based on the result
        setBlockingEnabled(isEnabled);
      } catch (error) {
        console.error('Error checking screenshot blocking status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the checkScreenshotStatus function when the component mounts
    checkScreenshotStatus();
  }, [setBlockingEnabled, setIsLoading]);
}

export default useGetPreventState;
