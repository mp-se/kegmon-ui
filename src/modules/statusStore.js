import { defineStore } from 'pinia'
import { useConfigStore } from './configStore'
import {
  sharedHttpClient as http,
  logDebug,
  logError,
  logInfo,
  tempToF
} from '@mp-se/espframework-ui-components'
import { weightKgToLbs, volumeCLtoUSOZ, volumeCLtoUKOZ } from '@/modules/utils.js'
import { global } from './pinia'

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
      connected: false,

      // Status
      id: '',
      mdns: '',
      wifi_ssid: '',
      weight_unit: '',
      volume_unit: '',
      temp_unit: '',
      rssi: 0,
      total_heap: 0,
      free_heap: 0,
      ip: '',
      wifi_setup: false,
      scale_busy: false,
      uptime_seconds: 0,
      uptime_minutes: 0,
      uptime_hours: 0,
      uptime_days: 0,
      scales: [],
      sensors: [],
      ha: {},
      brewspy: {},
      brewlogger: {},
      barhelper: {}
    }
  },
  getters: {},
  actions: {
    async load() {
      logInfo('statusStore.load()', 'Fetching /api/status')
      try {
        const json = await http.getJson('api/status')
        logDebug('statusStore.load()', json)
        const config = useConfigStore()

        this.connected = true

        // General properties
        this.id = json.id || ''
        this.mdns = json.mdns || ''
        this.wifi_ssid = json.wifi_ssid || ''
        this.weight_unit = json.weight_unit || ''
        this.volume_unit = json.volume_unit || ''
        this.temp_unit = json.temp_unit || 'C'
        this.rssi = json.rssi || 0
        this.total_heap = json.total_heap || 0
        this.free_heap = json.free_heap || 0
        this.ip = json.ip || ''
        this.wifi_setup = json.wifi_setup || false
        this.scale_busy = json.scale_busy || false
        this.uptime_seconds = json.uptime_seconds || 0
        this.uptime_minutes = json.uptime_minutes || 0
        this.uptime_hours = json.uptime_hours || 0
        this.uptime_days = json.uptime_days || 0

        // Parse scales array and trim to configured number of kegs
        const maxKegs = global.feature.no_kegs || 4
        this.scales = (json.scales || []).slice(0, maxKegs).map((scale) => ({
          ...scale,
          stable_weight: this._convertWeight(scale.stable_weight, config),
          pour_volume: this._convertVolume(scale.pour_volume, config),
          keg_volume: this._convertVolume(scale.keg_volume, config)
        }))

        // Parse sensors array
        this.sensors = json.sensors || []
        if (this.sensors.length > 0 && this.sensors[0]) {
          this.sensors[0].temperature = this._convertTemperature(
            this.sensors[0].temperature,
            config
          )
        }

        // Push status
        if (Object.prototype.hasOwnProperty.call(json, 'ha')) this.ha = json.ha
        if (Object.prototype.hasOwnProperty.call(json, 'brewspy')) this.brewspy = json.brewspy
        if (Object.prototype.hasOwnProperty.call(json, 'barhelper')) this.barhelper = json.barhelper
        if (Object.prototype.hasOwnProperty.call(json, 'brewlogger'))
          this.brewlogger = json.brewlogger

        logInfo('statusStore.load()', 'Fetching /api/status completed')
        return true
      } catch (err) {
        logError('statusStore.load()', err)
        return false
      }
    },
    _convertWeight(weight, config) {
      if (weight == null) return 0
      const converted = config.weight_unit === 'lbs' ? weightKgToLbs(weight) : weight
      return Number(converted).toFixed(2)
    },
    _convertVolume(volume, config) {
      if (volume == null) return 0
      let converted = volume
      if (config.volume_unit === 'us-oz') {
        converted = volumeCLtoUSOZ(volume)
      } else if (config.volume_unit === 'uk-oz') {
        converted = volumeCLtoUKOZ(volume)
      }
      return Number(converted).toFixed(2)
    },
    _convertTemperature(temp, config) {
      if (temp == null) return 0
      const converted = config.temp_unit === 'F' ? tempToF(temp) : temp
      return Number(converted).toFixed(2)
    }
  }
})
