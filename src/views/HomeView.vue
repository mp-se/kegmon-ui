<template>
  <div class="container">
    <p></p>

    <div v-if="status" class="container overflow-hidden text-center">
      <div class="row gy-4">
        <template v-for="(scale, index) in status.scales" :key="`measurement-${index}`">
          <div :class="getTapClass()" v-if="global.feature.no_kegs > index">
            <BsCard header="Measurement" color="info" :title="config.beers[index].beer_name">
              <p class="text-center">
                <BsProgress :progress="tapProgressArray[index]"></BsProgress>
              </p>
              <p class="text-center">
                Volume: {{ scale.pour_volume }} {{ config.getVolumeUnit }}<br />
                Weight: {{ scale.stable_weight }} {{ config.getWeightUnit }}<br />
                ABV: {{ config.beers[index].beer_abv }}% EBC:
                {{ config.beers[index].beer_ebc }} IBU: {{ config.beers[index].beer_ibu }}
              </p>
            </BsCard>
          </div>
        </template>
        <p></p>
      </div>

      <div class="row gy-4">
        <div class="col-md-4" v-if="status.sensors.length > 0 && status.sensors[0].temperature">
          <BsCard header="Measurement" color="info" title="Temperature">
            <p class="text-center">{{ status.sensors[0].temperature }} {{ config.getTempUnit }}</p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="status.ha != {} && config.mqtt_target != ''">
          <BsCard header="Push" color="secondary" title="Home Assistant">
            <p class="text-center">{{ pushHomeAssistant }}</p>
          </BsCard>
        </div>

        <div
          class="col-md-4"
          v-if="status.brewspy != {} && config.brewspy_tokens.some((token) => token != '')"
        >
          <BsCard header="Push" color="secondary" title="Brewspy">
            <p class="text-center">{{ pushBrewspy }}</p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="status.barhelper != {} && config.barhelper_apikey != ''">
          <BsCard header="Push" color="secondary" title="Barhelper">
            <p class="text-center">{{ pushBarhelper }}</p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="status.brewlogger != {} && config.brewlogger_url != ''">
          <BsCard header="Push" color="secondary" title="BrewLogger">
            <p class="text-center">{{ pushBrewLogger }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="WIFI">
            <p class="text-center">{{ status.rssi }} dBm - {{ status.wifi_ssid }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="IP Address">
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
              Firmware: {{ global.app_ver }} ({{ global.app_build }}) UI: {{ global.uiVersion }} ({{
                global.uiBuild
              }})
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Platform">
            <p class="text-center">
              <span class="badge text-bg-secondary">{{ global.platform }}</span>
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Device ID">
            <p class="text-center">{{ status.id }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Uptime">
            <p class="text-center">
              {{ status.uptime_days }} days {{ status.uptime_hours }} hours
              {{ status.uptime_minutes }} minutes {{ status.uptime_seconds }} seconds
            </p>
          </BsCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { status, global, config } from '@/modules/pinia'
import { logDebug, logError } from '@mp-se/espframework-ui-components'

const polling = ref(null)

const getTapClass = () => {
  const noKegs = global.feature.no_kegs
  if (noKegs >= 4) return 'col-md-3'
  if (noKegs === 3) return 'col-md-4'
  if (noKegs === 2) return 'col-md-6'
  return 'col-md-12'
}

const pushHomeAssistant = computed(() => {
  if (status.ha.push_used) {
    return (
      'Updated ' +
      new Number(status.ha.push_age / 1000).toFixed(0) +
      's ago, ' +
      (status.ha.push_status ? 'Success' : 'Failed, error ' + status.ha.push_code)
    )
  }

  return 'Not updated'
})

const pushBrewspy = computed(() => {
  if (status.brewspy.push_used) {
    return (
      'Updated ' +
      new Number(status.brewspy.push_age / 1000).toFixed(0) +
      's ago, ' +
      (status.brewspy.push_status ? 'Success' : 'Failed, error ' + status.brewspy.push_code)
    )
  }

  return 'Not updated'
})

const pushBrewLogger = computed(() => {
  if (status.brewlogger.push_used) {
    return (
      'Updated ' +
      new Number(status.brewlogger.push_age / 1000).toFixed(0) +
      's ago, ' +
      (status.brewlogger.push_status ? 'Success' : 'Failed, error ' + status.brewlogger.push_code)
    )
  }

  return 'Not updated'
})

const pushBarhelper = computed(() => {
  if (status.barhelper.push_used) {
    var payload = status.barhelper.push_response
    // Check for a faulty payload and fix it so we can parse it.
    if (payload.search('"volume:') != -1) {
      payload = payload.replace('volume:', 'volume":')
      payload = payload.replace('"\n', ',\n')
    }

    var message = ''

    try {
      var json = JSON.parse(payload)
      message = json.message
      logDebug('HomeView.pushBarhelper()', json)
    } catch (e) {
      logError('HomeView.pushBarhelper()', e, payload)
    }

    return (
      'Updated ' +
      new Number(status.barhelper.push_age / 1000).toFixed(0) +
      's ago, ' +
      (status.barhelper.push_status ? 'Success' : 'Failed, error ' + status.barhelper.push_code) +
      ', ' +
      message
    )
  }

  return 'Not updated'
})

function clampProgress(n) {
  if (typeof n !== 'number' || !isFinite(n) || isNaN(n)) return 0
  return Math.min(100, Math.max(0, Math.round(n)))
}

const tapProgressArray = computed(() => {
  return config.beers.map((_, index) => {
    const scale = status.scales[index]
    if (!scale || !scale.keg_volume || scale.keg_volume <= 0) return 0
    return clampProgress((scale.pour_volume / scale.keg_volume) * 100)
  })
})

async function refresh() {
  await status.load()
}

onBeforeMount(() => {
  refresh()
  polling.value = setInterval(refresh, 4000)
})

onBeforeUnmount(() => {
  clearInterval(polling.value)
})
</script>
