import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { Animated } from 'react-native';

export type StringMap = Record<string, string>;
export type NumberMap = Record<string, number>;
export type UnknownMap = Record<string, unknown>;
export type StringPairs = [string, string][];
export type RegexReplacements = Array<[RegExp, string]>;

export type VoidCallback = () => void;
export type BooleanCallback = (value: boolean) => void;
export type MessageCallback = (message: string) => void;
export type AnimatedCallback = (animated: boolean) => void;
export type AbortableTask = (signal: AbortSignal) => unknown;
export type AsyncTask<T> = () => Promise<T>;
export type ForceRefresh = boolean | void;

export type StateSetter<T> = Dispatch<SetStateAction<T>>;
export type NumberRef = MutableRefObject<number>;
export type NumberListRef = MutableRefObject<number[]>;

export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type IntervalHandle = ReturnType<typeof setInterval>;
export type IntervalRef = MutableRefObject<IntervalHandle | null>;

export type AnimatedNumber = Animated.AnimatedInterpolation<number>;
export type AnimatedScale = Animated.Value | AnimatedNumber;
export type AnimatedOrNumber = number | Animated.Value;
