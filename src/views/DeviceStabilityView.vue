<template>
  <div class="container">
    <p></p>
    <p class="h2">Device - Stability</p>
    <hr />

    <div class="row" v-if="loaded">
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_sum1" label="Scale 1 - Sum"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_sum2" label="Scale 2 - Sum"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_sum3" label="Scale 3 - Sum"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_sum4" label="Scale 4 - Sum"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_min1" label="Scale 1 - Min"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_min2" label="Scale 2 - Min"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_min3" label="Scale 3 - Min"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_min4" label="Scale 4 - Min"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_max1" label="Scale 1 - Max"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_max2" label="Scale 2 - Max"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_max3" label="Scale 3 - Max"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_max4" label="Scale 4 - Max"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_ave1" label="Scale 1 - Ave"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_ave2" label="Scale 2 - Ave"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_ave3" label="Scale 3 - Ave"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_ave4" label="Scale 4 - Ave"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_var1" label="Scale 1 - Var"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_var2" label="Scale 2 - Var"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_var3" label="Scale 3 - Var"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly v-model="stability.stability_var4" label="Scale 4 - Var"></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_popdev1"
          label="Scale 1 - Pop dev."
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_popdev2"
          label="Scale 2 - Pop dev."
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_popdev3"
          label="Scale 3 - Pop dev."
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_popdev4"
          label="Scale 4 - Pop dev."
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_ubiasdev1"
          label="Scale 1 - Ubias dev."
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_ubiasdev2"
          label="Scale 2 - Ubias dev."
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_ubiasdev3"
          label="Scale 3 - Ubias dev."
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_ubiasdev4"
          label="Scale 4 - Ubias dev."
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_count1"
          label="Scale 1 - Count"
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_count2"
          label="Scale 2 - Count"
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_count3"
          label="Scale 3 - Count"
        ></BsInputReadonly>
      </div>
      <div class="col-md-3">
        <BsInputReadonly
          v-model="stability.stability_count4"
          label="Scale 4 - Count"
        ></BsInputReadonly>
      </div>
    </div>

    <div class="row" v-else>
      <div class="col-md-3">
        <p>Unable to load stability data</p>
      </div>
    </div>

    <div class="row gy-2">
      <div class="col-md-12">
        <hr />
      </div>
      <div class="col-sm-12">
        <button
          @click="clearStability()"
          type="button"
          class="btn btn-secondary"
          :disabled="global.disabled"
        >
          Clear stability
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { global } from '@/modules/pinia'
import { logError, logInfo } from '@mp-se/espframework-ui-components'

const stability = ref({})
const loaded = ref(false)
const timer = ref(null)

onMounted(() => {
  getStability()
  timer.value = setInterval(() => {
    getStability()
  }, 4000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})

const getStability = () => {
  global.clearMessages()
  logInfo('DeviceStabilityView.getStability()', 'Sending /api/stability')
  global.disabled = true
  fetch(global.baseURL + 'api/stability', {
    headers: { Authorization: global.token },
    signal: AbortSignal.timeout(global.fetchTimout)
  })
    .then((res) => res.json())
    .then((json) => {
      stability.value = json
      global.disabled = false
      loaded.value = true
    })
    .catch((err) => {
      logError('DeviceStabilityView.getStability()', err)
      global.disabled = false
    })
}

const clearStability = () => {
  global.clearMessages()
  logInfo('DeviceStabilityView.clearStability()', 'Sending /api/stability/clear')
  global.disabled = true
  fetch(global.baseURL + 'api/stability/clear', {
    headers: { Authorization: global.token },
    signal: AbortSignal.timeout(global.fetchTimout)
  })
    .then((res) => res.json())
    .then(() => {
      global.disabled = false
    })
    .catch((err) => {
      logError('DeviceStabilityView.clearStability()', err)
      global.disabled = false
    })
}
</script>
