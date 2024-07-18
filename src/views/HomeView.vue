<template>
  <div class="container">
    <p></p>

    <div v-if="status" class="container overflow-hidden text-center">

      <div class="row gy-4">
        <div class="col-md-6">
          <BsCard header="Measurement" color="info" :title="config.beer_name1">
            <p class="text-center">
              <BsProgress :progress="tapProgress1"></BsProgress>
            </p>
            <p class="text-center">
              Volume: {{ status.beer_volume1 }} {{ config.getVolumeUnit }} Weight: {{ status.beer_weight1 }} {{ config.getWeightUnit }} Last pour: {{ status.last_pour_volume1 }} {{ config.getVolumeUnit }}
            </p>
            <p class="text-center">
              ABV: {{ config.beer_abv1 }}% EBC: {{ config.beer_ebc1 }} IBU: {{ config.beer_ibu1 }}
            </p>
          </BsCard>
        </div>
        <div class="col-md-6">
          <BsCard header="Measurement" color="info" :title="config.beer_name2">
            <p class="text-center">
              <BsProgress :progress="tapProgress2"></BsProgress>
            </p>
            <p class="text-center">
              Volume: {{ status.beer_volume2 }} {{ config.getVolumeUnit }} Weight: {{ status.beer_weight2 }} {{ config.getWeightUnit }} Last pour: {{ status.last_pour_volume2 }} {{ config.getVolumeUnit }}
            </p>
            <p class="text-center">
              ABV: {{ config.beer_abv2 }}% EBC: {{ config.beer_ebc2 }} IBU: {{ config.beer_ibu2 }}
            </p>
          </BsCard>
        </div>
        <p></p>
      </div>

      <div class="row gy-4">

        <div class="col-md-4" v-if="status.temp !== 'NaN'">
          <BsCard header="Measurement" color="info" title="Temperature">
            <p class="text-center">
              {{ status.temp }} {{ status.getTempFormat }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="status.temp === 'NaN'">
          <BsCard header="Measurement" title="Error" :iserr="true" icon="bi-x-circle">
            <p class="text-center">
              No temperature sensor detected
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="WIFI">
            <p class="text-center">
              {{ status.rssi }} dBm - {{ status.wifi_ssid }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="IP Adress">
            <p class="text-center">
              {{ status.ip }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Memory">
            <p class="text-center">
              Free: {{ status.free_heap }} kb, Total: {{ status.total_heap }} kb
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Software version">
            <p class="text-center">
              Firmware: {{ status.app_ver }} ({{ status.app_build }}) UI: {{ global.uiVersion }} ({{ global.uiBuild }})
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Platform">
            <p class="text-center">
              {{ status.platform }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Uptime">
            <p class="text-center">
              {{ status.uptime_days }} days {{ status.uptime_hours }} hours {{ status.uptime_minutes }} minutes {{ status.uptime_seconds }} seconds
            </p>
          </BsCard>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { status, global, config } from "@/modules/pinia"
import { logDebug, logError, logInfo } from '@/modules/logger'

// TODO: Add humidity from temp sensor
// TODO: Show # glasses left for taps
// TODO: Show last pour per tap

const polling = ref(null)

const tapProgress1 = computed(() => {
  return Math.round( (status.beer_volume1 / status.keg_volume1) * 100)
})

const tapProgress2 = computed(() => {
  return Math.round( (status.beer_volume2 / status.keg_volume2) * 100)
})

function refresh() {
  status.load((success) => {
  })
}

onBeforeMount(() => {
  refresh();
  polling.value = setInterval(refresh, 4000)
})

onBeforeUnmount(() => {
  clearInterval(polling.value)
})
</script>
