<script>
import { useFinanceStore } from "@/stores/financeStore";
import { onMounted } from "vue";

import { contentMixin } from "@/mixins/contentMixin.js";
import {
  sampleRecords,
  AMOUNT_SORT_TERM,
  DATE_SORT_TERM,
  BILLS,
  EXPENSES,
  SAVINGS,
} from "@/constants";
import { parseCurrency } from "@/utilities/financeUtility";
import { isEmpty, isNull } from "lodash";

export default {
  name: "TableView",
  setup() {
    const FinanceStore = useFinanceStore();

    onMounted(() => {
      sampleRecords.forEach((record) => FinanceStore.addRecord(record));
    });

    return {
      FinanceStore,
    };
  },
  mixins: [contentMixin],
  data() {
    return {
      filterOptions: [BILLS, EXPENSES, SAVINGS],
      sortOptions: [
        {
          displayKey: "Amount - Increasing",
          value: "Amount-Increasing",
        },
        {
          displayKey: "Amount - Decreasing",
          value: "Amount-Decreasing",
        },
        {
          displayKey: "Date - Most Recent",
          value: "Date-Decreasing",
        },
        {
          displayKey: "Date - Oldest",
          value: "Date-Increasing",
        },
      ],
    };
  },
  computed: {
    showClearAll() {
      return !isEmpty(this.FinanceStore.filters);
    },
  },
  methods: {
    deleteRecord(event, recordID) {
      this.FinanceStore.deleteRecord(recordID);
    },
    parseAmount(amount) {
      return parseCurrency(amount);
    },
    clearAllFilters() {
      this.FinanceStore.clearAllFilters();
    },
    isAlreadyFiltered(filter) {
      return (
        !isEmpty(this.FinanceStore.filters) &&
        this.FinanceStore.filters.indexOf(filter) > -1
      );
    },
    toggleFilterState(event, filter) {
      if (this.isAlreadyFiltered(filter)) {
        this.FinanceStore.removeFilter(filter);
      } else {
        this.FinanceStore.addFilter(filter);
      }
    },
    sortRecords(event) {
      if (typeof event.target.value === "string") {
        let params = event.target.value.split("-");
        let sortTerm =
          params[0]?.toLowerCase() === "date"
            ? DATE_SORT_TERM
            : AMOUNT_SORT_TERM;
        let isIncreasing = params[1]?.toLowerCase() === "increasing";
        if (!isEmpty(sortTerm) && !isNull(isIncreasing)) {
          this.FinanceStore.setSortOrder(isIncreasing);
          this.FinanceStore.setSortTerm(sortTerm);
        }
      }
    },
  },
};
</script>

<template>
  <div id="TableView">
    <div class="table-settings">
      <div class="float-left">
        <div class="filter-label">
          <p v-html="content.filterLabel" />
        </div>
        <div
          class="filter"
          v-bind:key="index"
          v-for="(filter, index) in filterOptions"
          @click="($event) => toggleFilterState($event, filter)"
          :class="isAlreadyFiltered(filter) ? 'remove' : 'add'"
        >
          <p v-html="filter" />
          <div class="filter-icon-container">
            <img
              class="remove icon"
              src="@/assets/images/icons8-close-50.png"
              alt="remove"
            />
            <img
              class="add icon"
              src="@/assets/images/icons8-plus-math-50.png"
              alt="remove"
            />
          </div>
        </div>
        <div v-if="showClearAll" class="clear-filters" @click="clearAllFilters">
          <p v-html="content.clearFiltersLabel" />
        </div>
      </div>
      <div class="float-right">
        <div class="sort-select">
          <label for="SortSelect" v-html="content.sortLabel" />
          <select id="SortSelect" @change="($event) => sortRecords($event)">
            <option
              v-bind:key="index"
              v-for="(sortOption, index) in sortOptions"
              :value="sortOption.value"
            >
              {{ sortOption.displayKey }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="header-row">
        <p class="category" v-html="content.categoryLabel" />
        <p class="description" v-html="content.descriptionLabel" />
        <p class="amount" v-html="content.amountLabel" />
        <p class="date" v-html="content.dateLabel" />
        <div class="bin-container" />
      </div>
      <div class="record-container">
        <div
          class="record"
          v-bind:key="index"
          v-for="(record, index) in FinanceStore.displayRecords"
        >
          <p
            class="category"
            :class="record.category"
            v-html="record.category"
          />
          <p class="description" v-html="record.description" />
          <p class="amount" v-html="parseAmount(record.amount)" />
          <p class="date" v-html="record.date" />
          <div class="bin-container">
            <img
              class="icon"
              src="@/assets/images/icons8-trash-50.png"
              alt="bin"
              @click="($event) => deleteRecord($event, record.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#TableView {
  width: 100%;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  .table-settings {
    margin: 20px auto;
    width: 95%;
    max-width: 1000px;
    height: 30px;
    .float-left {
      float: left;
      width: fit-content;
      height: 100%;
      display: flex;
      .filter-label {
        width: fit-content;
        height: 100%;
        padding: 0px;
        margin: auto 10px;
        @include exo;
        color: #6a7074;
        display: flex;
        p {
          padding: 0;
          font-size: 0.9em;
        }
      }
      .filter {
        width: fit-content;
        height: 100%;
        padding: 5px 8px;
        margin: auto 10px;
        border-radius: 5px;
        @include exo;
        display: flex;
        p {
          padding: 0;
          margin: auto 2px;
          font-size: 0.9em;
          @include wgt-500;
        }
        .icon {
          width: 20px;
          height: 20px;
          margin: auto;
        }
        .filter-icon-container {
          width: 20px;
          height: 20px;
          margin: auto 2px;
          position: relative;
          .remove,
          .add {
            position: absolute;
            top: 0;
          }
        }
        &.remove {
          color: #ebeeef;
          background-color: #3c5466;
          .filter-icon-container {
            .remove {
              opacity: 1;
            }
            .add {
              opacity: 0;
              visibility: hidden;
              transform: rotate(90deg);
            }
          }
          &:hover {
            background-color: #5d6c75;
          }
        }
        &.add {
          color: #5d6c75;
          background-color: #ebeeef;
          .filter-icon-container {
            .remove {
              opacity: 0;
              visibility: hidden;
              transform: rotate(90deg);
            }
            .add {
              opacity: 1;
            }
          }
          &:hover {
            background-color: #d8dada;
          }
        }
      }
      .clear-filters {
        width: fit-content;
        height: 100%;
        padding: 0px;
        margin: auto 10px;
        @include exo;
        color: #5d6c75;
        display: flex;
        p {
          padding: 0;
          font-size: 0.9em;
          text-decoration: underline;
        }
        &:hover {
          color: #859199;
        }
      }
      .filter,
      .clear-filters {
        &:hover {
          cursor: pointer;
        }
      }
    }
    .float-right {
      float: right;
      width: fit-content;
      height: 100%;
      display: flex;
      .sort-select {
        height: 100%;
        margin: auto 10px;
        label {
          @include exo;
          font-size: 0.9em;
          @include wgt-400;
          color: #012c42;
        }
        select {
          height: 100%;
          width: max-content;
          background-color: transparent;
          border: none;
          color: #012c42;
          @include exo;
          font-size: 0.9em;
          @include wgt-500;
        }
      }
    }
  }
  .table {
    margin: 10px auto;
    width: 95%;
    max-width: 1000px;
    height: fit-content;
    max-height: 550px;
    .header-row {
      height: 50px;
      width: 100%;
      border: 1px solid #3c5466;
      border-radius: 10px 10px 0px 0px;
      color: #ebeeef;
      background-color: #3c5466;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-around;
      p {
        display: inline;
        padding: 0px 10px;
        margin: auto;
        box-sizing: border-box;
        @include exo;
        @include wgt-500;
      }
      .category {
        width: 15%;
        padding-left: 20px;
        text-align: left;
      }
      .description {
        width: 35%;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .amount {
        width: 23%;
        text-align: center;
      }
      .date {
        width: 20%;
        text-align: center;
      }
      .bin-container {
        width: 7%;
      }
    }
    .record-container {
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      height: fit-content;
      border: 1px solid #cdd4d4;
      border-top: 0;
      border-radius: 0px 0px 10px 10px;
      max-height: 500px;
      .record {
        border-bottom: 1px dotted #cdd4d4;
        width: 100%;
        background-color: $white;
        height: fit-content;
        min-height: 60px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: space-around;
        p {
          display: inline;
          padding: 0px 10px;
          margin: auto;
          box-sizing: border-box;
        }
        .description,
        .amount,
        .date {
          @include exo;
          @include wgt-400;
          color: #737272;
        }
        .category {
          width: 15%;
          padding-left: 20px;
          text-align: left;
          @include teko;
          &.BILLS {
            color: #56a9a9;
            @include wgt-600;
            font-size: 1.1em;
          }
          &.EXPENSES {
            color: #579b79;
            @include wgt-600;
            font-size: 1.1em;
          }
          &.SAVINGS {
            color: #125635;
            @include wgt-600;
            font-size: 1.1em;
          }
        }
        .description {
          width: 35%;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .amount {
          width: 23%;
          text-align: center;
        }
        .date {
          width: 20%;
          text-align: center;
        }
        .bin-container {
          width: 7%;
          display: flex;
          .icon {
            margin: auto;
            width: 20px;
            height: 20px;
            @include grey-filter;
            &:hover {
              @include highlight-filter;
            }
          }
        }
      }
    }
  }
}
</style>
