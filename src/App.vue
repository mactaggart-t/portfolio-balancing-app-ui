<script setup>
import PortfolioDistributionGraph from './components/PortfolioDistributionGraph.vue';
import StockTable from './components/StockTable.vue';
import { MultiSelect } from 'primevue';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const stocksData = ref([]);
const filteredStockData = ref([]);
const sectorData = ref([]);
const allSectors = ref([])
const refreshKey = ref(0);
const selectedSectors = ref([]);

const fetchData = async () => {
  try {
    let response = await axios.get('http://127.0.0.1:5000/stocks');
    stocksData.value = response.data;
    filteredStockData.value = response.data;
    response = await axios.get('http://127.0.0.1:5000/sectors');
    sectorData.value = response.data;
    allSectors.value = [... new Set(response.data.map(sector => sector.Sector))];
    refreshKey.value += 1;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const filterBySector = () => {
  if (selectedSectors.value.length) { 
    filteredStockData.value = stocksData.value.filter(stock => selectedSectors.value.some(el => el === stock.Sector));
  } else {
    filteredStockData.value = stocksData.value;
  }
  refreshKey.value += 1;
};

const updateSectors = (sector) => {
  if (selectedSectors.value.includes(sector)) {
    selectedSectors.value = selectedSectors.value.filter(el => el !== sector);
  } else {
    selectedSectors.value = [...selectedSectors.value, sector];
  }
};

onMounted(fetchData);

watch(() => selectedSectors.value, filterBySector, { deep: true, immediate: true });
</script>

<template>
  <MultiSelect v-model="selectedSectors" :options="allSectors" placeholder="Select a Sector" class="w-full mb-4" />
  <div class="graph-container">
    <PortfolioDistributionGraph :data="filteredStockData" orderBy="Ticker" title="Portfolio Distribution by Stock" :key="refreshKey"/>
    <PortfolioDistributionGraph @barClicked="(el) => updateSectors(el.label)" :data="sectorData" orderBy="Sector" title="Portfolio Distribution by Sector" :key="refreshKey"/>
  </div>
  <StockTable :stocks="filteredStockData" :key="refreshKey"/>
</template>

<style scoped>
.graph-container {
  display: flex;
  flex-direction: row;
}
</style>
