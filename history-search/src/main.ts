import Vue from 'vue';
import App from './App.vue';
import { BASH_HISTORY_PATH, BASH_PATH, DOWN_ARROW_KEY, ENTER_KEY, ESCAPE_KEY, FISH_PATH, MAX_RESULTS, TAB_KEY, UP_ARROW_KEY, ZSH_PATH } from './common/constants';
import { loadBashHistory, loadZshHistory, loadFishHistory } from './common/fig-helpers';
import { getSelectionValues, shellPathToEnum } from './common/utils';
import store, { increment, decrement, setBuffer, getBuffer, addToHistory, getShellType, setShellType, getRow, ShellType, addToCache, setRow } from './store';

declare global {
  interface Window {
    fig: any;
  }
}


Vue.config.productionTip = false;

const vm = new Vue({
  render: (h) => h(App),
  mounted: async function () {
    // Overrides that we need for fig to actually pick up what is going on
    window.fig.init = async () => {
      console.log("fig.js has loaded! You can now run `fig` commands.")
      window.fig.pty.init()
      setTimeout(async () => {
        //window.fig.maxheight = `${140}`
      }, 750);
    }
    window.fig.autocomplete = (buffer: any, cursorIndex: any, windowID: any, tty: any, cwd: any, processUserIsIn: any, sshContextString: any) => {
      // The user has changed shell types || no initial shell type was assigned to prevent reloading - but we're fine now
      //if (shellPathToEnum(processUserIsIn) !== getShellType()) {
      switch (processUserIsIn) {
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
          setShellType(ShellType.Unknown)
          console.log("could not match to a path")
      }
      //}
      setBuffer(buffer);
    }
    window.fig.keypress = (appleKeyCode: any) => {
      switch (appleKeyCode) {
        case ENTER_KEY:
          window.fig.insert(" \n");
          addToCache(getBuffer());
          setRow(0);
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


