<template>
  <div class="container">
    <p></p>

    <div v-if="status" class="container overflow-hidden text-center">

      <div class="row gy-4">

        <div class="col-md-4" v-if="status.temp !== 'NaN'">
          <BsCard header="Measurement" color="info" title="Temperature">
            <p class="text-center">
              {{ status.temp }} °{{ status.temp_format }}
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

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { status, global } from "@/modules/pinia"
import { logDebug, logError, logInfo } from '@/modules/logger'

// TODO: Add humidity from temp sensor

const polling = ref(null)

function refresh() {
  status.load((success) => {
    if (success) {
      // TODO: Add values to display on main page
    }
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

<style></style>