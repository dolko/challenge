import { filter } from "vue/types/umd";
import { getHistory, getBuffer, ShellType, getCache, getRow } from "../store";
import { BASH_PATH, FISH_PATH, FUZZY_SEARCH, MAX_RESULTS, ZSH_PATH } from "./constants";
import { loadBashHistory, loadZshHistory, loadFishHistory } from "./fig-helpers";
import fuzz from "fuzzball";


function parseValues(values: string[]) {
    return [...new Set(values)].filter((ele) => {
        if (ele.trim().length === 0) {
            return false
        }
        return true
    });
}


function filterValues(values: string[], bufferValue: string): string[] {
    const parsedValues = parseValues(values);
    const rowNumber = getRow();
    const pageNumber = Math.floor(rowNumber / MAX_RESULTS)

    if (FUZZY_SEARCH && bufferValue.length > 0) {
        const topFuzzy = fuzz.extract(bufferValue, parsedValues).slice(0, MAX_RESULTS);
        return topFuzzy.map((value, index, arr) => {
            return value[0];
        });
    } else {
        return parsedValues
            .filter((command) => command.startsWith(bufferValue))
            .slice(pageNumber * MAX_RESULTS, (pageNumber + 1) * MAX_RESULTS);
    }
}

export const getSelectionValues = () => {

    const history = getHistory();
    const cache = getCache();
    const bufferValue = getBuffer();
    const combined = history.concat(cache).reverse();

    const combinedValues = filterValues(combined, bufferValue);
    return combinedValues;
}

export const shellPathToEnum = (path: string): ShellType => {
    switch (path) {
        case BASH_PATH:
            return ShellType.Bash
        case ZSH_PATH:
            return ShellType.Zsh
        case FISH_PATH:
            return ShellType.Fish
        default:
            return ShellType.Unknown
    }
}