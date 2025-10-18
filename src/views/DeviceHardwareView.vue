<template>
  <div class="container">
    <p></p>
    <p class="h3">Device - Hardware</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-12">
          <BsInputRadio
            v-model="config.temp_sensor"
            :options="tempSensorOptions"
            label="Temperature sensor"
            width=""
            :disabled="global.disabled"
          ></BsInputRadio>
        </div>

        <div class="col-md-6" v-if="config.temp_sensor == 1">
          <BsInputText
            v-model="config.chamberctrl_url"
            type="url"
            maxlength="120"
            label="Chamber Controller URL"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6" v-if="config.temp_sensor == 2">
          <BsInputText
            v-model="config.brewpi_url"
            type="url"
            maxlength="120"
            label="BrewPI URL"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.scale_deviation_increase"
            label="Scale deviation increase"
            min=".05"
            max="1.0"
            step=".05"
            :unit="config.weight_unit"
            help="Default 0.5 kg (0.05 - 1.00)"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.scale_deviation_decrease"
            label="Scale deviation decrease"
            min=".05"
            max="1.0"
            step=".05"
            :unit="config.weight_unit"
            help="Default 0.1 kg (0.05 - 1.00)"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.scale_deviation_kalman"
            label="Scale deviation kalman"
            min=".01"
            max="0.1"
            step=".01"
            :unit="config.weight_unit"
            help="Default 0.04 kg (0.01 - 0.10)"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.scale_stable_count"
            label="Scale stable count"
            min="6"
            max="30"
            step="1"
            help="Number of stable readings required for a new level to be set (6 - 30)"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.scale_read_count"
            label="Scale sample count"
            min="1"
            max="50"
            step="1"
            help="Number of samples from the scale driver (1 - 50)"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.scale_read_count_calibration"
            label="Scale sample count during calibration"
            min="1"
            max="100"
            step="1"
            help="Number of samples from the scale driver when doing a calibration (1 - 100)"
            :disabled="global.disabled"
          />
        </div>
      </div>

      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-12">
          <button
            type="submit"
            class="btn btn-primary w-2"
            :disabled="global.disabled || !global.configChanged"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save</button
          >&nbsp;

          <button
            @click="restart()"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Restart device
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'

const tempSensorOptions = ref([
  { label: 'DS18B20', value: 0 },
  { label: 'Chamber Ctrl (Network)', value: 1 }
  // { label: 'BrewPI (Network)', value: 2 },
])

const save = () => {
  if (!validateCurrentForm()) return

  global.clearMessages()
  config.saveAll()
}

async function restart() {
  await config.restart()
}
</script>
