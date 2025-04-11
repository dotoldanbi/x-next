import { createSlice } from "@reduxjs/toolkit";
const newsSlice = createSlice({
  name: "newsSlice",
  initialState: {
    news: [],
  },
  reducers: {
    setNewsList: (state, action) => {
      state.news = action.payload;
    },
  },
});

export const { setNewsList } = newsSlice.actions;

// 디폴트로 슬라이스의 리듀서를 export합니다.
export default newsSlice.reducer;
