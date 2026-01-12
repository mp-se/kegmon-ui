<template>
  <div class="container">
    <p></p>
    <p class="h2">Device - Statistics</p>
    <hr />

    <div class="row" v-if="loaded">
      <div class="col-md-12">
        <p class="h4">Level Statistics</p>
        <div class="table-responsive">
          <table class="table table-sm table-striped" style="table-layout: fixed">
            <thead>
              <tr>
                <th>Index</th>
                <th>State</th>
                <th class="text-end">Confidence</th>
                <th class="text-end">Total Pours</th>
                <th class="text-end">Total Volume</th>
                <th class="text-end">Avg Pour Volume</th>
                <th class="text-end">Max Pour Volume</th>
                <th class="text-end">Min Pour Volume</th>
                <th class="text-end">Avg Duration (sec)</th>
                <th class="text-end">Keg Replacements</th>
                <th class="text-end">Current Age (hrs)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in statistics.level_statistics" :key="`level-${stat.index}`">
                <td>{{ stat.index }}</td>
                <td>{{ stat.state }}</td>
                <td class="text-end">{{ stat.confidence }}%</td>
                <td class="text-end">{{ stat.total_pours }}</td>
                <td class="text-end">{{ stat.total_pour_volume }}</td>
                <td class="text-end">{{ Number(stat.avg_pour_volume).toFixed(2) }}</td>
                <td class="text-end">{{ Number(stat.max_pour_volume).toFixed(2) }}</td>
                <td class="text-end">{{ Number(stat.min_pour_volume).toFixed(2) }}</td>
                <td class="text-end">{{ Number(stat.avg_pour_duration_sec).toFixed(2) }}</td>
                <td class="text-end">{{ stat.keg_replacements }}</td>
                <td class="text-end">{{ stat.current_keg_age_hours }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-md-12">
        <p class="h4">Scale Statistics</p>
        <div class="table-responsive">
          <table class="table table-sm table-striped" style="table-layout: fixed">
            <thead>
              <tr>
                <th>Index</th>
                <th class="text-end">Total Readings</th>
                <th class="text-end">Valid</th>
                <th class="text-end">Invalid</th>
                <th class="text-end">Quality (%)</th>
                <th class="text-end">Frequency (Hz)</th>
                <th class="text-end">Raw Avg</th>
                <th class="text-end">Raw Min</th>
                <th class="text-end">Raw Max</th>
                <th class="text-end">Current Variance</th>
                <th class="text-end">Stable Variance</th>
                <th class="text-end">Calibration Drift/hr</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in statistics.scale_statistics" :key="`scale-${stat.index}`">
                <td>{{ stat.index }}</td>
                <td class="text-end">{{ stat.total_readings }}</td>
                <td class="text-end">{{ stat.valid_readings }}</td>
                <td class="text-end">{{ stat.invalid_readings }}</td>
                <td class="text-end">{{ Number(stat.reading_quality).toFixed(1) }}</td>
                <td class="text-end">{{ Number(stat.reading_frequency).toFixed(2) }}</td>
                <td class="text-end">{{ Number(stat.raw_average).toFixed(0) }}</td>
                <td class="text-end">{{ Number(stat.raw_min).toFixed(0) }}</td>
                <td class="text-end">{{ Number(stat.raw_max).toFixed(0) }}</td>
                <td class="text-end">{{ Number(stat.current_variance).toFixed(2) }}</td>
                <td class="text-end">{{ Number(stat.stable_state_variance).toFixed(2) }}</td>
                <td class="text-end">{{ Number(stat.calibration_drift_per_hour).toFixed(3) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="row" v-else>
      <div class="col-md-3">
        <p>Unable to load statistics data</p>
      </div>
    </div>

    <div class="row gy-2">
      <div class="col-md-12">
        <hr />
      </div>
      <div class="col-sm-12">
        <button
          @click="clearStatistics()"
          type="button"
          class="btn btn-secondary"
          :disabled="global.disabled"
        >
          Clear statistics
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { global } from '@/modules/pinia'
import { logError, logInfo, sharedHttpClient as http } from '@mp-se/espframework-ui-components'

const statistics = ref({
  level_statistics: [],
  scale_statistics: []
})
const loaded = ref(false)
const timer = ref(null)

onMounted(() => {
  getStatistics()
  timer.value = setInterval(() => {
    getStatistics()
  }, 4000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})

const getStatistics = async () => {
  global.clearMessages()
  logInfo('DeviceStatisticsView.getStatistics()', 'Fetching /api/statistics')
  global.disabled = true
  try {
    const json = await http.getJson('api/statistics')
    statistics.value = json
    global.disabled = false
    loaded.value = true
  } catch (err) {
    logError('DeviceStatisticsView.getStatistics()', err)
    global.disabled = false
  }
}

const clearStatistics = async () => {
  global.clearMessages()
  logInfo('DeviceStatisticsView.clearStatistics()', 'Sending /api/statistics/clear')
  global.disabled = true
  try {
    await http.getJson('api/statistics/clear')
    global.disabled = false
  } catch (err) {
    logError('DeviceStatisticsView.clearStatistics()', err)
    global.disabled = false
  }
}
</script>
