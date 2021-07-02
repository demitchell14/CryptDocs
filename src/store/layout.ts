import type { RootState } from "./index";
import {createSlice} from "@reduxjs/toolkit";

interface LayoutState {
    mode: 'day'|'night'|'auto';
}

const initialState: LayoutState = {
    mode: 'auto'
};

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        setNight: (state) => {
            state.mode = 'night';
        },
        setDay: (state) => {
            state.mode = 'day';
            console.log(state)
        },
        setAuto: (state) => {
            state.mode = 'auto';
        }
    },
});

export const { setAuto, setDay, setNight } = layoutSlice.actions;

export const selectLayout = (state: RootState) => state.layout;

export default layoutSlice.reducer;