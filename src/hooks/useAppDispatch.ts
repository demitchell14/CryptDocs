import { RootState, AppDispatch } from "../store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {Dispatch, ThunkDispatch, Action as ReduxAction} from "@reduxjs/toolkit";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const useAppDispatch2 = () => useDispatch<AppDispatch>()//  as ThunkDispatch<RootState, any, any>
