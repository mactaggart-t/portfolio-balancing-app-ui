<script setup>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart, registerables, LinearScale } from 'chart.js';

Chart.register(...registerables, LinearScale);

const props = defineProps({
  data: Object,
  orderBy: String,
  title: String,
})

const emit = defineEmits(['barClicked']);

// Sample Data
const chartData = ref({
  labels: props.data.map(el => el[props.orderBy]),
  datasets: [
    {
      label: 'Market Value ($)',
      data: props.data.map(el => el['Total Value']),
      portfolioPercentages: props.data.map(el => el['Percentage of Portfolio']),
      title: { display: true, text: 'Market Value ($)' },
      yAxisID: 'y', // Primary Y-axis (Left)
    },
  ]
});

// Chart Options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      type: 'linear',
      position: 'left',
      ticks: {
        callback: value => `$${value.toLocaleString()}`, // Format as currency
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw;
          const index = context.dataIndex;
          const percentage = chartData.value.datasets[0].portfolioPercentages[index] || 0; // Get % for this index
          return [`Market Value: $${value.toFixed(2).toLocaleString()}`, `Portfolio Percentage: ${percentage.toFixed(2)}%`];
        }
      }
    },
    title: {
      display: true,
      text: props.title,
      font: { size: 18, weight: 'bold' },
      padding: { top: 10, bottom: 20 },
      align: 'center'
    },
    legend: { display: false }
  },
  responsive: true,
  onClick: (event, elements, chart) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];
      const value = chart.data.datasets[0].data[index];
      emit('barClicked', { label });
    }
  },
});
</script>

<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 1250px;
  height: 700px;
  margin: auto;
}
</style>
