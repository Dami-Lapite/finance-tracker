import { defineStore } from "pinia";
import { isNull, isEmpty, cloneDeep } from "lodash";
import { DATE_SORT_TERM, AMOUNT_SORT_TERM } from "@/constants";

export const useFinanceStore = defineStore("FinanceStore", {
  state() {
    return {
      records: [],
      filters: [],
      sortTerm: AMOUNT_SORT_TERM,
      sortIncreasing: true,
      index: 1,
      searchTerm: "",
    };
  },
  getters: {
    displayRecords: (state) => {
      let displayRecords = cloneDeep(state.records);
      if (!isEmpty(state.filters)) {
        displayRecords = displayRecords.filter(
          (record) => state.filters.indexOf(record.category) > -1
        );
      }
      if (!isEmpty(state.searchTerm)) {
        displayRecords = displayRecords.filter(
          (record) =>
            record.description
              .toLowerCase()
              .indexOf(state.searchTerm.toLowerCase()) > -1
        );
      }
      if (!isNull(state.sortTerm)) {
        if (state.sortTerm === DATE_SORT_TERM) {
          if (state.sortIncreasing) {
            displayRecords.sort((a, b) => {
              let dateA = new Date(a.date);
              let dateB = new Date(b.date);
              return dateA.getTime() - dateB.getTime();
            });
          } else {
            displayRecords.sort((a, b) => {
              let dateA = new Date(a.date);
              let dateB = new Date(b.date);
              return dateB.getTime() - dateA.getTime();
            });
          }
        } else if (state.sortTerm === AMOUNT_SORT_TERM) {
          if (state.sortIncreasing) {
            displayRecords.sort((a, b) => a.amount - b.amount);
          } else {
            displayRecords.sort((a, b) => b.amount - a.amount);
          }
        }
      }
      return displayRecords;
    },
  },
  actions: {
    addFilter(filter) {
      if (this.filters.indexOf(filter) <= -1) {
        this.filters.push(filter);
      }
    },
    removeFilter(filter) {
      const index = this.filters.indexOf(filter);
      if (index > -1) {
        this.filters.splice(index, 1);
      }
    },
    clearAllFilters() {
      this.filters = [];
    },
    addRecord(record) {
      this.records.push({ ...record, id: this.index });
      this.index += 1;
    },
    deleteRecord(recordID) {
      this.records = this.records.filter((record) => record.id !== recordID);
    },
    setSearchTerm(searchTerm) {
      this.searchTerm = searchTerm;
    },
    setSortTerm(sortTerm) {
      this.sortTerm = sortTerm;
    },
    setSortOrder(isIncreasing) {
      this.sortIncreasing = isIncreasing;
    },
  },
});
