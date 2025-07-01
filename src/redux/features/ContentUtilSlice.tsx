// contentUtils.ts
import { AppDispatch } from '../store';
import http from "@/redux/http";

// Cache object to store API responses
const apiCache: Record<string, { data: any, timestamp: number }> = {};

// Cache expiration time (in milliseconds) - e.g., 5 minutes
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const fetchContent = (uri: string, setContentStart: () => any, setContentSuccess: (content: any) => any, setContentFailure: (error: string) => any) => async (dispatch: AppDispatch) => {
  dispatch(setContentStart());
  
  try {
    // Check if we have a valid cached response
    const cachedResponse = apiCache[uri];
    const now = Date.now();
    
    if (cachedResponse && (now - cachedResponse.timestamp < CACHE_EXPIRATION)) {
      console.log('Using cached data for:', uri);
      dispatch(setContentSuccess(cachedResponse.data));
      return;
    }
    
    // If no cache or expired, fetch from API
    const response = await http.fetchDataWithToken(uri);
    console.log(response);
    
    // Store in cache
    apiCache[uri] = {
      data: response,
      timestamp: now
    };
    
    dispatch(setContentSuccess(response));
  } catch (error: any) {
    console.error('fetchContent error:', error);
    dispatch(setContentFailure(error.message));
  }
};

// Clear cache for a specific URI or all cache if no URI provided
export const clearCache = (uri?: string) => {
  if (uri) {
    delete apiCache[uri];
  } else {
    Object.keys(apiCache).forEach(key => delete apiCache[key]);
  }
};

export const postContent = (uri: string, formData: any, setContentStart: () => any, setContentSuccess: (content: any) => any, setContentFailure: (error: string) => any) => async (dispatch: AppDispatch) => {
  dispatch(setContentStart());
  try {
    const response = await http.postDataWithToken(uri, formData);
    
    // Clear cache for this URI since we've posted new data
    clearCache(uri);
    
    dispatch(setContentSuccess(response));
    return response;
  } catch (error: any) {
    console.error('postContent error:', error);
    dispatch(setContentFailure(error.message));
    throw error;
  } 
};
