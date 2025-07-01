import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchContent, postContent } from "./ContentUtilSlice";

interface AboutContent {
  [key: string]: unknown;
}

interface AboutState {
  content: AboutContent | null, 
  loading: boolean,
  error: string | null,
}

const initialState: AboutState = {
  content: null,
  loading: false,
  error: null,
};

export const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    setContentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setContentSuccess: (state, action: PayloadAction<AboutContent>) => {
      state.loading = false;
      state.content = action.payload;
    },
    setContentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setContentStart, setContentSuccess, setContentFailure } = aboutSlice.actions;

export const fetchAboutContent = (uri: string) => fetchContent(uri, setContentStart, setContentSuccess, setContentFailure);

export const postAboutContent = (uri: string, formData: AboutContent) => {
  const fd = new FormData();
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    if (typeof value === 'string') {
      fd.append(key, value);
    } else if (value instanceof Blob) {
      fd.append(key, value);
    }
  });
  return postContent(uri, fd, setContentStart, setContentSuccess, setContentFailure);
};

export default aboutSlice.reducer;
