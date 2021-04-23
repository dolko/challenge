// These are the differnt keys that we can have that fig intercepts
export const ESCAPE_KEY = "53"
export const DOWN_ARROW_KEY = "125"
export const UP_ARROW_KEY = "126"
export const TAB_KEY = "48"
export const ENTER_KEY = "36"

// Parameter that the app uses for things like result numbers, whether to use fuzzy etc.
export const MAX_RESULTS = 10
export const FUZZY_SEARCH = true

// These paths match to what is given to us by fig
export const FISH_PATH = "/usr/local/bin/fish"
export const ZSH_PATH = "/bin/zsh"
export const BASH_PATH = "/bin/bash"

// These paths are important for retrieving the history for the type of shell
export const BASH_HISTORY_PATH = "~/.bash_history";
export const ZSH_HISTORY_PATH = "~/.zsh_history";
export const FISH_HISTORY_PATH = "~/.local/share/fish/fish_history";
