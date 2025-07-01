
// import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from './counter/counterSlice';

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch } from 'react-redux';
import CounterReducer from './features/CounterSlice';
import AuthReducer from './features/AuthSlice';
import samplePostsReducer from './features/SamplePostsSlice';
// Import the API service
import { api } from './services/api';

const rootReducer = combineReducers({
  // Add the API service reducer
  [api.reducerPath]: api.reducer,
  samplePosts: samplePostsReducer,
  counter: CounterReducer,
  auth: AuthReducer,
});

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // List of reducers to persist
  blacklist: [api.reducerPath], // Don't persist API cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredActionPaths: ['meta.arg', 'payload.register'],
        ignoredPaths: ['auth.someNonSerializableField'],
      },
    })
    // Add the api middleware to enable caching, invalidation, polling, etc.
    .concat(api.middleware),
});

export const persistor = persistStore(store);

// Enable the RTK-Query refetchOnFocus/refetchOnReconnect features
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();