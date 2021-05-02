import { BASH_PATH, ZSH_PATH, FISH_PATH, ENTER_KEY, TAB_KEY, UP_ARROW_KEY, DOWN_ARROW_KEY, ESCAPE_KEY, BASH_HISTORY_PATH, ZSH_HISTORY_PATH, FISH_HISTORY_PATH, ZSH_CONFIG_PATH } from "./constants"
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

// c: '%a %d %b %Y %X %Z',

export const loadBashHistory = async () => {
    const bash_history = await fread(BASH_HISTORY_PATH);
    const bash_history_format = await ptyexecute("$HISTTIMEFORMAT");
    if (bash_history_format.trim().length === 0) {
        // The user doesn't have a histtimeformat
        console.log("User does not have a HISTTIMEFORMAT set");
        clearHistory();
        addToHistory(bash_history.split("\n"));
    }
    else {
        // Objective here is to translate the bash_history_format from a string
        // into a regex expression so that we can capsure and then trim the start of
        // the string that we want to get rid of

        // Replace the english local short formats that translate into other portions
        bash_history_format.replace("%X", "%r");
        bash_history_format.replace("%x", "%D");
        bash_history_format.replace("%c", '%a %d %b %Y %X %Z');
        bash_history_format.replace("%D", "%m/%d/%y");
        bash_history_format.replace("%F", "%Y-%m-%d");
        bash_history_format.replace("%R", "%H:%M");
        bash_history_format.replace("%r", "%I:%M:%S %p");
        bash_history_format.replace("%T", "%H:%M:%S");
        bash_history_format.replace("%v", "%e-%b-%Y");

        // for more details on how would implement the portion that would convert the individual
        // letters from their forms look at: https://github.com/samsonjs/strftime/blob/master/strftime.js
        // this file has the case for all formats in the strftime but we're looking at going the other way
        // ie date -> stftime
        // For simplicity lets assume all these simple forms are just going to be numbers or letters
        // so %_ => [A-Za-z0-9_]+
        const historyRegex = RegExp(bash_history_format.replace(/%[A-Za-z]/g, "[A-Za-z0-9_]+"));
        const bash_history_lines = bash_history.split("\n");
        const bash_history_lines_parsed = bash_history_lines.map((val) => { return val.replace(historyRegex, "") });

        clearHistory();
        addToHistory(bash_history_lines_parsed);
        console.log(`History time format: ${bash_history_format}`);
    }

}

const parseZshHistory = (history: string): string[] => {
    const historyLines = history.split("\n");
    // Need to check if the zsh variable for whether it is using a 

    return historyLines;
}

export const loadZshHistory = async () => {
    const zsh_history = await fread(ZSH_HISTORY_PATH);
    const zsh_config = await fread(ZSH_CONFIG_PATH);
    // the formatting for this is similar to how we do it for bash
    // we want to however get the value for HIST_STAMPS from the zsh config file
    const zsh_config_vals = zsh_config.split("\n").filter((val) => { if (val.includes("HIST_STAMPS") && !val.startsWith("#")) { return true } else { return false } });
    if (zsh_config_vals.length > 0) {
        // we have a value set for the hist stamps so we want to read it and then parse it like we did for the bash shell
    }

    clearHistory();
    addToHistory(parseZshHistory(zsh_history));
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