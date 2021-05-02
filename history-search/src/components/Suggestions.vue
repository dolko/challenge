<template>
  <div>
    <table class="styled-table">
      <tbody>
        <div v-for="item in historyValue()" :key="item.value">
          <tr v-if="item.highlighted === true" class="active-row">
            <td class="active-row">
              {{ item.value }}
            </td>
          </tr>
          <tr v-else>
            <td>
              {{ item.value }}
            </td>
          </tr>
        </div>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store, {
  increment,
  decrement,
  setBuffer,
  getBuffer,
  getHistory,
  getRow,
  setRow,
} from "../store";
import { getSelectionValues } from "../common/utils";
import { MAX_RESULTS } from "../common/constants";

declare global {
  interface Window {
    fig: any;
  }
}

interface rowSuggestion {
  highlighted: boolean;
  value: string;
}

@Component
export default class Suggestions extends Vue {
  @Prop() private msg!: string;
  bufferValue() {
    return getBuffer();
  }
  historyValue(): rowSuggestion[] {
    // figure out what commands we actually want to have in the dropdown

    const historyValues = getSelectionValues();

    // Figure out how big we want the dropdown
    // Unfortunately there's a weird fig interaction taht if you make the maxheight zero then it stops recording anything
    if (historyValues.length === 0) {
      window.fig.maxheight = `${20}`;
    } else {
      window.fig.maxheight = `${historyValues.length * 26}`;
    }

    let selectedRow = getRow() % MAX_RESULTS;
    if (selectedRow >= historyValues.length && historyValues.length > 0) {
      selectedRow = historyValues.length;
      setRow(historyValues.length - 1);
    }

    const historyRows: rowSuggestion[] = [];
    historyValues.forEach((val, index) => {
      historyRows.push({
        highlighted: index === selectedRow,
        value: val,
      });
    });
    return historyRows;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.styled-table {
  /* border-collapse: collapse; */
  font-size: 0.9em;
  font-family: sans-serif;
  width: 100%;
  color: rgb(180, 180, 180);
  background-color: rgb(48, 48, 48);
  white-space: nowrap;
  border: 1px;
}

.styled-table th,
.styled-table td {
  height: 20px;
  width: 100%;
}

.styled-table tbody tr.active-row {
  background-color: rgb(30, 90, 199);
  color: rgb(253, 253, 253);
  width: 100%;
  height: 100%;
}

.active-item {
  background-color: var(--selected-bg-color);
}

.active-item .text {
  color: var(--selected-text-color);
}
</style>

