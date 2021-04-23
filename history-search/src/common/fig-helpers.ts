import { BASH_PATH, ZSH_PATH, FISH_PATH, ENTER_KEY, TAB_KEY, UP_ARROW_KEY, DOWN_ARROW_KEY, ESCAPE_KEY, BASH_HISTORY_PATH, ZSH_HISTORY_PATH, FISH_HISTORY_PATH } from "./constants"
import { getShellType, setShellType, setBuffer, addToHistory, getBuffer, decrement, increment, clearHistory } from "../store"

// The different shims that we have for doing things with fig
const fread = (path: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        window.fig.fread(path, (data: string, err: any) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

const fwrite = (path: any, data: unknown) => {
    return new Promise((resolve, reject) => {
        window.fig.fwrite(path, data, (err: any) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

const ptyexecute = (command: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        window.fig.pty.execute(command, (data: string, err: any) => {
            if (err) {
                console.log(err);
                return reject(err)
            }
            resolve(data)
        })
    })
}

export const loadBashHistory = async () => {
    const bash_history = await fread(BASH_HISTORY_PATH);
    clearHistory();
    addToHistory(bash_history.split("\n"));
}

export const loadZshHistory = async () => {
    const zsh_history = await fread(ZSH_HISTORY_PATH);
    clearHistory();
    addToHistory(zsh_history.split("\n"));
}

export const loadFishHistory = async () => {
    const fish_history = await fread(FISH_HISTORY_PATH);
    clearHistory();
    const fish_raw = fish_history.split("\n");
    const fish_cmds = fish_raw.filter((value, index, arr) => {
        if (value.startsWith("- cmd:")) {
            return true
        } else {
            return false
        }
    }).map((value, index, arr) => {
        return value.replace("- cmd:", "").trim();
    })
    addToHistory(fish_cmds);
}


// const filesInHomeDirectory = await ptyexecute("(history)")
// const parsedHistory = filesInHomeDirectory.split("\n").map((val, index, array) => {
//   const newval = val.trim().replace(/[ 0-9]+/, "");
//   return newval;
// });
// console.log(parsedHistory);
// addToHistory(parsedHistory);