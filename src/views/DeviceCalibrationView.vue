<template>
    <div class="container">
        <p></p>
        <p class="h2">Device - Calibration</p>
        <hr>

        <div class="row" v-if="state == 1">
            <div class="col-md-12">
                <p class="h3">Step 1 - Select scale</p>
            </div>
            <div class="col-md-12">
                <BsInputRadio v-model="scale" :options="scaleOptions" label="Select which scale to calibrate" width=""
                    :disabled="global.disabled || state > 1"></BsInputRadio>
            </div>
            <div class="row gy-2">
                <div class="col-md-12">
                    <button @click="step1()" type="button" class="btn btn-secondary" :disabled="global.disabled">
                        Select scale
                    </button>
                </div>
            </div>
        </div>

        <div class="row" v-if="state == 2">
            <div class="col-md-12">
                <p class="h3">Step 2 - Reset scale</p>
            </div>
            <div class="col-md-12">
                <p>Remove any object from the scale and press the tare button to reset it to zero.</p>
            </div>
            <div class="row gy-2">
                <div class="col-md-12">
                    <button @click="step2()" type="button" class="btn btn-secondary" :disabled="global.disabled">
                        Reset scale
                    </button>
                </div>
            </div>
        </div>

        <div class="row" v-if="state == 3">
            <div class="col-md-12">
                <p class="h3">Step 3 - Calibrate scale</p>
            </div>
            <div class="col-md-12">
                <p>Place a known weight on the scale and press the factor button. The scale will calculate a factor and complete calibration. Use any known weight.</p>
            </div>

            <div class="col-md-12">
                <BsInputNumber v-model="weight" width="5" label="Calibration weight" min="0" max="25" step=".01" :unit="config.weight_unit"
                        :disabled="global.disabled" />
            </div>

            <div class="row gy-2">
                <div class="col-md-12">
                    <button @click="step3()" type="button" class="btn btn-secondary" :disabled="global.disabled">
                        Calculate factor
                    </button>
                </div>
            </div>
        </div>

        <div class="row" v-if="state == 4">
            <div class="col-md-12">
                <p class="h3">Step 4 - Validate</p>
            </div>
            <div class="row gy-2">
                <div class="col-md-12">
                    <button @click="step4()" type="button" class="btn btn-secondary" :disabled="global.disabled">
                        Validate
                    </button>
                </div>
            </div>

        </div>

        <div class="row p-3">
            <div class="col-md-12">
                <p></p>
            </div>

            <!-- TODO: Change colors when darkmode is enabled -->

            <div class="col-md-3 p-3 border bg-light">
                Offset: {{ scaleOffset }}
            </div>
            <div class="col-md-3 p-3 border bg-light">
                Factor: {{ scaleFactor }}
            </div>
            <div class="col-md-3 p-3 border bg-light">
                Raw: {{ scaleRaw }}
            </div>
            <div class="col-md-3 p-3 border bg-light">
                Weight: {{ scaleWeight }} {{ config.weight_unit }}
            </div>
        </div>

    </div>
</template>

<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { weightKgToLbs } from "@/modules/utils"
import { global, config, status } from "@/modules/pinia"
import * as badge from '@/modules/badge'
import { logDebug, logError, logInfo } from '@/modules/logger'

const state = ref(1)
const scale = ref(1)
const weight = ref(0)

const scaleOptions = ref([
    { label: 'Scale 1', value: 1 },
    { label: 'Scale 2', value: 2 },
])

const scaleOffset = computed(() => {
  return scale.value == 1 ? status.scale_offset1 : status.scale_offset2
})

const scaleFactor = computed(() => {
  return scale.value == 1 ? status.scale_factor1 : status.scale_factor2
})

const scaleRaw = computed(() => {
  return scale.value == 1 ? status.scale_raw1 : status.scale_raw2
})

const scaleWeight = computed(() => {
    var w = scale.value == 1 ? status.scale_weight1 : status.scale_weight2
    return new Number(config.weight_unit == "kg" ? w : weightKgToLbs(w)).toFixed(3)
})

const step1 = () => {
    state.value = 2
}

/*
 * Reset scale
 */
const step2 = () => {

    // TODO: Fetch status and check that values has changed

    state.value = 3
}

/*
 * Perform calibration
 */
const step3 = () => {

    // TODO: Fetch status and check that the factor is calculated

    state.value = 4
}

/*
 * Validate the weight
 */
 const step4 = () => {

    // TODO: Validate the value against the weight

    // TODO: Add option to start calibration again

    // state.value = 5
}

onBeforeMount(() => {
    state.value = 1
})
</script>
