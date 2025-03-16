<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import numeral from "numeral";

const props = defineProps({
    stocks: Array,
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatCurrencyReadable = (value) => {
  return `$${numeral(value).format("0.00a").toUpperCase()}`;
};

const formatPercentage = (value) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)}`; // Convert from whole number if needed
};

const columns = [
    { field: 'Ticker', header: 'Ticker' },
    { field: 'Company Name', header: 'Company Name' },
    { field: 'Current Price', header: 'Current Price', formatter: formatCurrency },
    { field: 'Total Value', header: 'Market Value', formatter: formatCurrency },
    { field: 'Sector', header: 'Sector' },
    { field: 'Industry', header: 'Industry' },
    { field: 'Percentage of Portfolio', header: 'Percentage of Portfolio', formatter: formatPercentage },
    { field: 'Shares Owned', header: 'Shares' },
    { field: 'P/E Ratio', header: 'P/E Ratio'},
    { field: 'Market Cap', header: 'Market Cap', formatter: formatCurrencyReadable},
    { field: 'Dividend Yield', header: 'Dividend Yield', formatter: formatPercentage },
    { field: 'Dividend Rate', header: 'Dividend Rate', formatter: formatCurrency }
];


</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4 text-center">Stock Portfolio</h2>
    <DataTable v-if="stocks.length" :value="stocks" paginator :rows="10" class="shadow-md">
      <Column v-for="col in columns" :field="col.field" :header="col.header" sortable>
        <template #body="slotProps">
          {{ col.formatter ? col.formatter(slotProps.data[col.field]) : slotProps.data[col.field] }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>