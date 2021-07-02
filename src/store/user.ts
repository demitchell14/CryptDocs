import type { RootState } from "./index";
import {createSlice, createAsyncThunk, AsyncThunkAction, Dispatch} from "@reduxjs/toolkit";

export interface UserState {
    authenticated: boolean;
    hello: string;
}

const initialState: UserState = {
    authenticated: false,
    hello: 'world',
};

type AuthenticationResponse = {
    authenticated: boolean;
}

export const handleAuthentication = createAsyncThunk<AuthenticationResponse, void, { state: RootState }>(
    'user/authenticate',
    (noop, { signal }) => {
        return new Promise((r, rr) => setTimeout(() => {
            if (signal.aborted) {
                rr();
                return;
            }
            r({
                authenticated: true
            });
        }, 2000));
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        lolHi: (state) => {
            state.hello = 'lol no..'
            console.log(state);
            for (const x in state) {
                console.log(x, state[x]);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(handleAuthentication.fulfilled, (state, action) => {
            state.authenticated = action.payload.authenticated;
            // state.authenticating = false;
        })
    }
});


export const { lolHi } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;