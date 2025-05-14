// App Configuration Settings

// App version - increment this when pushing app updates that require data refreshing
export const APP_VERSION = '1.0.0';

// App version storage key in localStorage
export const APP_VERSION_KEY = 'app-version';

// Time in milliseconds for how long to cache queries (set to 0 to disable caching)
export const QUERY_CACHE_TIME = 0; 

// Time in milliseconds to keep stale data (set to 0 to always refetch)
export const QUERY_STALE_TIME = 0;

// Whether to force refresh product data on app start
export const FORCE_REFRESH_ON_START = true;
