import Vue from "vue";
import { MAX_RESULTS } from "./common/constants";
// The observable is our store where we want to store the state accross the app
// this includes things like what the buffer currently is, the buffer
export enum ShellType {
    Unknown,
    Bash,
    Zsh,
    Fish
}

interface AppState {
    row: number;
    buffer: string;
    history: string[];
    shellType: ShellType;
    bashCache: string[];
    zshCache: string[];
    fishCache: string[];
    allCache: string[];
    results: string[];
}


const state = Vue.observable<AppState>({ row: 0, buffer: "", history: [], shellType: ShellType.Unknown, allCache: [], zshCache: [], bashCache: [], fishCache: [], results: [] });
export const increment = () => { state.row++ };
export const decrement = () => { if (state.row > 0) { state.row-- } };
export const setRow = (newRow: number) => { state.row = newRow }
export const getRow = () => { return state.row };
export const setBuffer = (newBuffer: string) => state.buffer = newBuffer;
export const getBuffer = () => { return state.buffer };
export const addToHistory = (newHistory: string[]) => state.history.push(...newHistory);
export const getHistory = () => { return state.history };
export const clearHistory = () => { state.history = [] }
export const getShellType = () => { return state.shellType };
export const setShellType = (shellType: ShellType) => state.shellType = shellType;
export const addToCache = (newLine: string) => {
    //state.allCache.push(newLine);
    switch (state.shellType) {
        case ShellType.Bash:
            state.bashCache.push(newLine);
            break
        case ShellType.Zsh:
            state.zshCache.push(newLine);
            break
        case ShellType.Fish:
            state.fishCache.push(newLine);
            break
    }
}
export const getCache = (): string[] => {
    //return state.allCache
    switch (state.shellType) {
        case ShellType.Bash:
            return state.bashCache
        case ShellType.Zsh:
            return state.zshCache
        case ShellType.Fish:
            return state.fishCache
    }
    return []
}
export default state;