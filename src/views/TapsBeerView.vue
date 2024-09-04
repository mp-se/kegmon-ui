<template>
  <div class="container">
    <p></p>
    <p class="h3">Taps - Beers</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6">
          <BsInputText
            v-model="config.beer_name1"
            maxlength="20"
            label="Beer 1 - Name"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.beer_name2"
            maxlength="20"
            label="Beer 2 - Name"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_fg1"
            label="Beer 1 - FG"
            min="0"
            max="2"
            step="0.0001"
            width="5"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_fg2"
            label="Beer 2 - FG"
            min="0"
            max="2"
            step="0.0001"
            width="5"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_ebc1"
            label="Beer 1 - EBC"
            min="0"
            max="100"
            step="1"
            width="5"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_ebc2"
            label="Beer 2 - EBC"
            min="0"
            max="100"
            step="1"
            width="5"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_ibu1"
            label="Beer 1 - IBU"
            min="0"
            max="100"
            step="1"
            width="5"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_ibu2"
            label="Beer 2 - IBU"
            min="0"
            max="100"
            step="1"
            width="5"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_abv1"
            label="Beer 1 - ABV"
            min="0"
            max="20"
            step="0.1"
            unit="%"
            width="5"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_abv2"
            label="Beer 2 - ABV"
            min="0"
            max="20"
            step="0.1"
            unit="%"
            width="5"
            :disabled="global.disabled"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <p></p>
        </div>
        <div class="col-md-6">
          <button
            @click="fetchBrewfather(1)"
            type="button"
            class="btn btn-secondary w-2"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Fetch from Brewfather</button
          >&nbsp;
          <button
            @click="fetchBrewspy(1)"
            type="button"
            class="btn btn-secondary w-2"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Fetch from Brewspy
          </button>
        </div>

        <div class="col-md-6">
          <button
            @click="fetchBrewfather(2)"
            type="button"
            class="btn btn-secondary w-2"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Fetch from Brewfather</button
          >&nbsp;
          <button
            @click="fetchBrewspy(2)"
            type="button"
            class="btn btn-secondary w-2"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Fetch from Brewspy
          </button>
        </div>
      </div>

      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-3">
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
            &nbsp;Save
          </button>
        </div>
      </div>
    </form>

    <BsModalSelect
      v-model="beer"
      :callback="confirmBeerCallback"
      message="Select a beer to use for the tap"
      id="beer"
      title="Select beer"
      :options="beerOptions"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validateCurrentForm } from '@/modules/utils'
import { global, config } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

const beerOptions = ref([])
const beer = ref('')
const tapNo = ref(0)

const confirmBeerCallback = (result, value) => {
  logDebug('TapsBeerView.confirmSearchCallback()', result, value)

  if (result) {
    global.clearMessages()
    global.disabled = true
    if (value != '') {
      beerOptions.value.forEach((e) => {
        if (e.value == value) {
          logDebug('TapsBeerView.confirmBeerCallback()', e)

          if (tapNo.value == 1) {
            config.beer_abv1 = e.abv
            config.beer_ebc1 = Math.ceil(e.ebc)
            config.beer_ibu1 = e.ibu
            config.beer_name1 = e.label
          } else if (tapNo.value == 2) {
            config.beer_abv2 = e.abv
            config.beer_ebc2 = Math.ceil(e.ebc)
            config.beer_ibu2 = e.ibu
            config.beer_name2 = e.label
          } else {
            logError('TapsBeerView.confirmBeerCallback()', 'Invalid tapNo', tapNo.value)
          }

          global.disabled = false
          return
        }
      })
    }
  } else {
    global.disabled = false
  }
}

const fetchBrewfather = (tap) => {
  logInfo('TapsBeerView.fetchBrewfather()', tap)

  global.disabled = true
  var auth = btoa(config.brewfather_userkey + ':' + config.brewfather_apikey)
  beerOptions.value = []
  beer.value = ''

  fetch(
    'https://api.brewfather.app/v2/batches?status=Completed&include=recipe.name,estimatedFg,estimatedColor,estimatedIbu,measuredAbv&complete=false',
    {
      method: 'GET',
      headers: { Authorization: 'Basic ' + auth },
      signal: AbortSignal.timeout(global.fetchTimout)
    }
  )
    .then((res) => res.json())
    .then((json) => {
      for (var i = 0; i < json.length; i++) {
        logInfo('TapsBeerView.fetchBrewfather()', json[i])

        /* TODO Remove this when validated
        var abv = json[i].hasOwnProperty('measuredAbv') ? json[i].measuredAbv : 0
        var ibu = json[i].hasOwnProperty('estimatedIbu') ? json[i].estimatedIbu : 0
        var ebc = json[i].hasOwnProperty('estimatedColor') ? json[i].estimatedColor : 0
        var fg = json[i].hasOwnProperty('estimatedFg') ? json[i].estimatedFg : 1
        */

        var abv = Object.prototype.hasOwnProperty.call(json[i], 'measuredAbv')
          ? json[i].measuredAbv
          : 0
        var ibu = Object.prototype.hasOwnProperty.call(json[i], 'estimatedIbu')
          ? json[i].estimatedIbu
          : 0
        var ebc = Object.prototype.hasOwnProperty.call(json[i], 'estimatedColor')
          ? json[i].estimatedColor
          : 0
        var fg = Object.prototype.hasOwnProperty.call(json[i], 'estimatedFg')
          ? json[i].estimatedFg
          : 1

        var beer = {
          label: json[i].recipe.name,
          value: json[i].batchNo,
          abv: abv,
          ibu: ibu,
          ebc: ebc,
          fg: fg
        }
        beerOptions.value.push(beer)
      }

      logInfo('TapsBeerView.fetchBrewfather()', beerOptions.value)
      tapNo.value = tap
      document.getElementById('beer').click()
    })
    .catch((err) => {
      logError('TapsBeerView.fetchBrewfather()', err)
      global.messageError = 'Failed to fetch data from brewfather'
      global.disabled = false
    })
}

const fetchBrewspy = (tap) => {
  logInfo('TapsBeerView.fetchBrewspy()', tap)

  global.disabled = true
  fetch(global.baseURL + 'api/brewspy/tap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: global.token },
    body: JSON.stringify({ token: tap == 1 ? config.brewspy_token1 : config.brewspy_token2 }),
    signal: AbortSignal.timeout(global.fetchTimout)
  })
    .then((res) => res.json())
    .then((json) => {
      logDebug('configStore.sendBrewspyRequest()', json)

      if (tap == 1) {
        config.beer_abv1 = json.abv
        config.beer_ebc1 = 0
        config.beer_ibu1 = 0
        config.beer_name1 = json.recipe
      } else if (tap == 2) {
        config.beer_abv2 = json.abv
        config.beer_ebc2 = 0
        config.beer_ibu2 = 0
        config.beer_name2 = json.recipe
      } else {
        logError('TapsBeerView.fetchBrewspy()', 'Invalid tap', tap)
      }

      global.disabled = false
    })
    .catch((err) => {
      logError('configStore.sendBrewspyRequest()', err)
      global.messageError = 'Failed to fetch data from brewspy'
      global.disabled = false
    })
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
