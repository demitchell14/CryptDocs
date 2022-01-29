import type { RootState } from "./index";
import {createSlice} from "@reduxjs/toolkit";

interface LayoutState {
    mode: 'day'|'night'|'auto';
}

const initialState: LayoutState = {
    mode: window.localStorage.getItem('theme-mode') as 'day'|'night' || 'auto'
};

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        setNight: (state) => {
            state.mode = 'night';
            window.localStorage.setItem('theme-mode', 'night')
        },
        setDay: (state) => {
            state.mode = 'day';
            window.localStorage.setItem('theme-mode', 'day')
            console.log(state)
        },
        setAuto: (state) => {
            state.mode = 'auto';
            window.localStorage.setItem('theme-mode', 'auto')
        }
    },
});

export const { setAuto, setDay, setNight } = layoutSlice.actions;

export const selectLayout = (state: RootState) => state.layout;

export default layoutSlice.reducer;