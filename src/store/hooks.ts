import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// типизированный dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// типизированный selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
