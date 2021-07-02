import {AnyAction, configureStore, createAsyncThunk, Middleware} from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from 'redux-thunk';
import user from './user';
import layout from "./layout";
import {ThunkMiddlewareFor} from "@reduxjs/toolkit/dist/getDefaultMiddleware";

export const store = configureStore({
    reducer: {
        user,
        layout,
    },
    // middleware: [thunk, logger] as [ThunkMiddlewareFor<any>, Middleware],
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;