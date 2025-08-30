import { AppConfigType } from './types';

// The full URL to your WordPress REST API endpoint.
const CONFIG_API_ENDPOINT = 'https://klccprint.com/wp-json/klcc-print/v1/config';

export const fetchAppConfig = async (): Promise<AppConfigType> => {
    const response = await fetch(CONFIG_API_ENDPOINT);

    if (!response.ok) {
        // This error will be caught by the App component and displayed to the user.
        throw new Error('Could not load configuration from WordPress. Please ensure the API endpoint is active and returns valid data.');
    }

    const config: AppConfigType = await response.json();
    
    // For production, you could add validation here to ensure the received 
    // config matches the expected structure defined in AppConfigType.
    
    return config;
};