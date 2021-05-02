import Vue from 'vue';
import App from './App.vue';
import { BASH_HISTORY_PATH, BASH_PATH, DOWN_ARROW_KEY, ENTER_KEY, ESCAPE_KEY, FISH_PATH, MAX_RESULTS, TAB_KEY, UP_ARROW_KEY, ZSH_PATH } from './common/constants';
import { loadBashHistory, loadZshHistory, loadFishHistory } from './common/fig-helpers';
import { getSelectionValues, shellPathToEnum } from './common/utils';
import store, { increment, decrement, setBuffer, getBuffer, addToHistory, getShellType, setShellType, getRow, ShellType, addToCache, setRow } from './store';
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueVirtualScroller from "vue-virtual-scroller";


declare global {
  interface Window {
    fig: any;
  }
}



Vue.use(VueVirtualScroller);
Vue.config.productionTip = false;

const vm = new Vue({
  render: (h) => h(App),
  mounted: async function () {
    document.documentElement.setAttribute("dark", "true");
    // Overrides that we need for fig to actually pick up what is going on
    window.fig.init = async () => {
      console.log("fig.js has loaded! You can now run `fig` commands.")
      window.fig.pty.init()
      setTimeout(async () => {
        // can set some timeout to execute some tasks in here...
      }, 750);
    }
    window.fig.autocomplete = (buffer: any, cursorIndex: any, windowID: any, tty: any, cwd: any, processUserIsIn: any, sshContextString: any) => {
      // The process that the user in might be null or undefined if fig is not completely set up with it
      // In that case we want to assume that the user is using their defualt shell and to use that
      console.log(`buffer is: ${buffer}`)
      console.log(`Process user is in ${processUserIsIn}`);
      console.log(window.fig)
      let processType: string;
      if (processUserIsIn === null || processUserIsIn === undefined) {
        console.log(`The user process is not defined using the default value for the user shell: ${window.fig.settings.userShell}`)
        console.log(window.fig)
        processType = window.fig.settings.userShell;
      } else {
        processType = processUserIsIn;
      }

      // The user has changed shell types || no initial shell type was assigned to prevent reloading - but we're fine now
      if (shellPathToEnum(processUserIsIn) !== getShellType()) {
        console.log(`Attempting to load the data for ${processType}`);
        switch (processType) {
          case BASH_PATH:
            loadBashHistory()
            setShellType(ShellType.Bash)
            break
          case ZSH_PATH:
            loadZshHistory()
            setShellType(ShellType.Zsh)
            break
          case FISH_PATH:
            loadFishHistory()
            setShellType(ShellType.Fish)
            break
          default:
            // Could not match to a type with the autocomplete:
            // we should default to using the fig.
            console.warn("Autocomplete could not detect the shell that the user was using through the fig.settings.userShell OR the processUserIsIn ")
        }
      }
      setBuffer(buffer);
    }
    window.fig.keypress = (appleKeyCode: any) => {
      console.log(`Intercepted key with code ${appleKeyCode}`);
      switch (appleKeyCode) {
        case ENTER_KEY:
          window.fig.insert(" \n");
          addToCache(getBuffer());
          setRow(0);
          // we need to reload the history if it is a zsh or a fish shell
          if (getShellType() === ShellType.Zsh) {
            console.log("Reloading the zsh history");
            loadZshHistory();
          }
          if (getShellType() === ShellType.Fish) {
            console.log("Reloading the fish history");
            loadFishHistory();
          }
          break
        case TAB_KEY:
          const selections = getSelectionValues();
          if (selections.length > 0) {
            const row = getRow() % MAX_RESULTS;
            const value_to_enter = selections[row].substring(getBuffer().length);
            window.fig.insert(value_to_enter);
          }
          break
        case UP_ARROW_KEY:
          decrement();
          break
        case DOWN_ARROW_KEY:
          increment();
          break
        case ESCAPE_KEY:
          break
        default:
          console.log(appleKeyCode)
      }
    }


  },
}).$mount('#app');


