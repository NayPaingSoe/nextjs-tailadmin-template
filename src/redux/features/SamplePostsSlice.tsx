import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchContent, postContent } from "./ContentUtilSlice";

interface SamplePostsContent {
  [key: string]: any;
}

interface SamplePostsState {
  content: SamplePostsContent | null, 
  loading: boolean,
  error: string | null,
}

const initialState: SamplePostsState = {
  content: null,
  loading: false,
  error: null,
};

export const samplePostsSlice = createSlice({
  name: "samplePosts",
  initialState,
  reducers: {
    setContentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setContentSuccess: (state, action: PayloadAction<SamplePostsContent>) => {
      state.loading = false;
      state.content = action.payload;
    },
    setContentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setContentStart, setContentSuccess, setContentFailure } = samplePostsSlice.actions;

export const fetchSamplePostsContent = (uri: string) => fetchContent(uri, setContentStart, setContentSuccess, setContentFailure);

export const postSamplePostsContent = (uri: string, formData: any) => postContent(uri, formData, setContentStart, setContentSuccess, setContentFailure);

export default samplePostsSlice.reducer;
