import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { getErrorString } from '@/modules/utils'
import { logDebug, logError, logInfo, sharedHttpClient as http } from '@mp-se/espframework-ui-components'

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      // Device
      id: '',
      mdns: '',
      temp_format: '',
      weight_unit: '',
      volume_unit: '',
      dark_mode: false,
      // Hardware
      ota_url: '',
      temp_sensor: 0,
      brewpi_url: '',
      chamberctrl_url: '',
      scale_deviation_increase: 0,
      scale_deviation_decrease: 0,
      scale_deviation_kalman: 0,
      scale_read_count: 0,
      scale_read_count_calibration: 0,
      scale_stable_count: 0,
      // Wifi
      wifi_portal_timeout: 0,
      wifi_connect_timeout: 0,
      wifi_ssid: '',
      wifi_ssid2: '',
      wifi_pass: '',
      wifi_pass2: '',
      // Push - Generic
      push_timeout: 10,
      brewfather_apikey: '',
      brewfather_userkey: '',
      brewspy_token1: '',
      brewspy_token2: '',
      brewspy_token3: '',
      brewspy_token4: '',
      barhelper_apikey: '',
      barhelper_monitor1: '',
      barhelper_monitor2: '',
      barhelper_monitor3: '',
      barhelper_monitor4: '',
      brewlogger_url: '',
      // Push - Http Post 1
      http_post_target: '',
      http_post_header1: '',
      http_post_header2: '',
      // Push - Http Post 2
      http_post2_target: '',
      http_post2_header1: '',
      http_post2_header2: '',
      // Push - Http Get
      http_get_target: '',
      http_get_header1: '',
      http_get_header2: '',
      // Push - Influx
      influxdb2_target: '',
      influxdb2_org: '',
      influxdb2_bucket: '',
      influxdb2_token: '',
      // Push - MQTT
      mqtt_target: '',
      mqtt_port: '',
      mqtt_user: '',
      mqtt_pass: '',
      // Keg 1
      scale_temp_formula1: '',
      scale_factor1: 0,
      scale_offset1: 0,
      keg_weight1: 0,
      keg_volume1: 0,
      glass_volume1: 0,
      beer_name1: '',
      beer_id1: '',
      beer_abv1: 0,
      beer_fg1: 0,
      beer_ebc1: 0,
      beer_ibu1: 0,
      // Keg 2
      scale_temp_formula2: '',
      scale_factor2: 0,
      scale_offset2: 0,
      keg_weight2: 0,
      keg_volume2: 0,
      glass_volume2: 0,
      beer_name2: '',
      beer_id2: '',
      beer_abv2: 0,
      beer_fg2: 0,
      beer_ebc2: 0,
      beer_ibu2: 0,
      // Keg 3
      scale_temp_formula3: '',
      scale_factor3: 0,
      scale_offset3: 0,
      keg_weight3: 0,
      keg_volume3: 0,
      glass_volume3: 0,
      beer_name3: '',
      beer_id3: '',
      beer_abv3: 0,
      beer_fg3: 0,
      beer_ebc3: 0,
      beer_ibu3: 0,
      // Keg 4
      scale_temp_formula4: '',
      scale_factor4: 0,
      scale_offset4: 0,
      keg_weight4: 0,
      keg_volume4: 0,
      glass_volume4: 0,
      beer_name4: '',
      beer_id4: '',
      beer_abv4: 0,
      beer_fg4: 0,
      beer_ebc4: 0,
      beer_ibu4: 0
    }
  },
  getters: {
    getVolumeUnit() {
      return this.volume_unit == 'cl' ? 'cl' : 'fl. oz'
    },
    getWeightUnit() {
      return this.weight_unit == 'kg' ? 'kg' : 'lbs'
    },
    getTempUnit() {
      return this.temp_format == 'C' ? '°C' : '°F'
    }
  },
  actions: {
    toJson() {
      logInfo('configStore.toJSON()')
      var dest = {}

      for (var key in this.$state) {
        if (!key.startsWith('$')) {
          dest[key] = this[key]
        }
      }

      logInfo('configStore.toJSON()', dest)
      return JSON.stringify(dest, null, 2)
    },
    async load() {
      global.disabled = true
      logInfo('configStore.load()', 'Fetching /api/config')
      try {
        const json = await http.getJson('api/config')
        logDebug('configStore.load()', json)
        global.disabled = false
        this.id = json.id
        // Device
        this.mdns = json.mdns
        this.temp_format = json.temp_format
        this.weight_unit = json.weight_unit
        this.volume_unit = json.volume_unit
        this.dark_mode = json.dark_mode
        // Hardware
        this.ota_url = json.ota_url
        this.temp_sensor = json.temp_sensor
        this.brewpi_url = json.brewpi_url
        this.chamberctrl_url = json.chamberctrl_url
        this.scale_deviation_increase = json.scale_deviation_increase
        this.scale_deviation_decrease = json.scale_deviation_decrease
        this.scale_deviation_kalman = json.scale_deviation_kalman
        this.scale_read_count = json.scale_read_count
        this.scale_read_count_calibration = json.scale_read_count_calibration
        this.scale_stable_count = json.scale_stable_count
        // Wifi
        this.wifi_portal_timeout = json.wifi_portal_timeout
        this.wifi_connect_timeout = json.wifi_connect_timeout
        this.wifi_ssid = json.wifi_ssid
        this.wifi_ssid2 = json.wifi_ssid2
        this.wifi_pass = json.wifi_pass
        this.wifi_pass2 = json.wifi_pass2
        // Push - Generic
        this.push_timeout = json.push_timeout
        this.brewfather_apikey = json.brewfather_apikey
        this.brewfather_userkey = json.brewfather_userkey
        this.brewspy_token1 = json.brewspy_token1
        this.brewspy_token2 = json.brewspy_token2
        this.brewspy_token3 = json.brewspy_token3
        this.brewspy_token4 = json.brewspy_token4
        this.barhelper_apikey = json.barhelper_apikey
        this.barhelper_monitor1 = json.barhelper_monitor1
        this.barhelper_monitor2 = json.barhelper_monitor2
        this.barhelper_monitor3 = json.barhelper_monitor3
        this.barhelper_monitor4 = json.barhelper_monitor4
        this.brewlogger_url = json.brewlogger_url
        // Push - Http Post 1
        this.http_post_target = json.http_post_target
        this.http_post_header1 = json.http_post_header1
        this.http_post_header2 = json.http_post_header2
        // Push - Http Post 2
        this.http_post2_target = json.http_post2_target
        this.http_post2_header1 = json.http_post2_header1
        this.http_post2_header2 = json.http_post2_header2
        // Push - Http Get
        this.http_get_target = json.http_get_target
        this.http_get_header1 = json.http_get_header1
        this.http_get_header2 = json.http_get_header2
        // Push - Influx
        this.influxdb2_target = json.influxdb2_target
        this.influxdb2_org = json.influxdb2_org
        this.influxdb2_bucket = json.influxdb2_bucket
        this.influxdb2_token = json.influxdb2_token
        // Push - MQTT
        this.mqtt_target = json.mqtt_target
        this.mqtt_port = json.mqtt_port
        this.mqtt_user = json.mqtt_user
        this.mqtt_pass = json.mqtt_pass
        // Keg 1
        this.scale_temp_formula1 = json.scale_temp_formula1
        this.scale_factor1 = json.scale_factor1
        this.scale_offset1 = json.scale_offset1
        this.keg_weight1 = json.keg_weight1
        this.keg_volume1 = json.keg_volume1
        this.glass_volume1 = json.glass_volume1
        this.beer_name1 = json.beer_name1
        this.beer_abv1 = json.beer_abv1
        this.beer_fg1 = json.beer_fg1
        this.beer_ebc1 = json.beer_ebc1
        this.beer_ibu1 = json.beer_ibu1
        // Keg 2
        this.scale_temp_formula2 = json.scale_temp_formula2
        this.scale_factor2 = json.scale_factor2
        this.scale_offset2 = json.scale_offset2
        this.keg_weight2 = json.keg_weight2
        this.keg_volume2 = json.keg_volume2
        this.glass_volume2 = json.glass_volume2
        this.beer_name2 = json.beer_name2
        this.beer_abv2 = json.beer_abv2
        this.beer_fg2 = json.beer_fg2
        this.beer_ebc2 = json.beer_ebc2
        this.beer_ibu2 = json.beer_ibu2
        // Keg 3
        this.scale_temp_formula3 = json.scale_temp_formula3
        this.scale_factor3 = json.scale_factor3
        this.scale_offset3 = json.scale_offset3
        this.keg_weight3 = json.keg_weight3
        this.keg_volume3 = json.keg_volume3
        this.glass_volume3 = json.glass_volume3
        this.beer_name3 = json.beer_name3
        this.beer_abv3 = json.beer_abv3
        this.beer_fg3 = json.beer_fg3
        this.beer_ebc3 = json.beer_ebc3
        this.beer_ibu3 = json.beer_ibu3
        // Keg 4
        this.scale_temp_formula4 = json.scale_temp_formula4
        this.scale_factor4 = json.scale_factor4
        this.scale_offset4 = json.scale_offset4
        this.keg_weight4 = json.keg_weight4
        this.keg_volume4 = json.keg_volume4
        this.glass_volume4 = json.glass_volume4
        this.beer_name4 = json.beer_name4
        this.beer_abv4 = json.beer_abv4
        this.beer_fg4 = json.beer_fg4
        this.beer_ebc4 = json.beer_ebc4
        this.beer_ibu4 = json.beer_ibu4
        return true
      } catch (err) {
        global.disabled = false
        logError('configStore.load()', err)
        return false
      }
    },
    async sendConfig() {
      global.disabled = true
      logInfo('configStore.sendConfig()', 'Sending /api/config')

      var data = getConfigChanges()
      logDebug('configStore.sendConfig()', data)

      if (JSON.stringify(data).length == 2) {
        logInfo('configStore.sendConfig()', 'No config data to store, skipping step')
        global.disabled = false
        return true
      }

      try {
        await http.postJson('api/config', data)
        global.disabled = false
        logInfo('configStore.sendConfig()', 'Sending /api/config completed')
        return true
      } catch (err) {
        logError('configStore.sendConfig()', err)
        global.disabled = false
        return false
      }
    },
    async sendPushTest(data) {
      global.disabled = true
      logInfo('configStore.sendPushTest()', 'Sending /api/push')
      try {
        await http.postJson('api/push', data)
        return true
      } catch (err) {
        logError('configStore.sendPushTest()', err)
        return false
      }
    },
    async getPushTestStatus() {
      logInfo('configStore.getPushTest()', 'Fetching /api/push/status')
      try {
        const json = await http.getJson('api/push/status')
        logDebug('configStore.getPushTest()', json)
        logInfo('configStore.getPushTest()', 'Fetching /api/push/status completed')
        return { success: true, data: json }
      } catch (err) {
        logError('configStore.getPushTest()', err)
        return { success: false, data: null }
      }
    },
    async sendWifiScan() {
      global.disabled = true
      logInfo('configStore.sendWifiScan()', 'Sending /api/wifi')
      try {
        await http.request('api/wifi')
        logInfo('configStore.sendWifiScan()', 'Sending /api/wifi completed')
        return true
      } catch (err) {
        logError('configStore.sendWifiScan()', err)
        return false
      }
    },
    async getWifiScanStatus() {
      logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status')
      try {
        const json = await http.getJson('api/wifi/status')
        logDebug('configStore.getWifiScanStatus()', json)
        logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status completed')
        return { success: true, data: json }
      } catch (err) {
        logError('configStore.getWifiScanStatus()', err)
        return { success: false, data: null }
      }
    },
    async sendHardwareScan() {
      global.disabled = true
      logInfo('configStore.sendHardwareScan()', 'Sending /api/hardware')
      try {
        await http.request('api/hardware')
        logInfo('configStore.sendHardwareScan()', 'Sending /api/hardware completed')
        return true
      } catch (err) {
        logError('configStore.sendHardwareScan()', err)
        return false
      }
    },
    async getHardwareScanStatus() {
      logInfo('configStore.getHardwareScanStatus()', 'Fetching /api/hardware/status')
      try {
        const json = await http.getJson('api/hardware/status')
        logDebug('configStore.getHardwareScanStatus()', json)
        logInfo('configStore.getHardwareScanStatus()', 'Fetching /api/hardware/status completed')
        return { success: true, data: json }
      } catch (err) {
        logError('configStore.getHardwareScanStatus()', err)
        return { success: false, data: null }
      }
    },
    async saveAll() {
      global.clearMessages()
      global.disabled = true
      const success = await this.sendConfig()
      if (!success) {
        global.disabled = false
        global.messageError = 'Failed to store configuration to device'
        return false
      } else {
        global.messageSuccess = 'Configuration has been saved to device'
        saveConfigState()
        return true
      }
    },
    async sendFilesystemRequest(data) {
      global.disabled = true
      logInfo('configStore.sendFilesystemRequest()', 'Sending /api/filesystem')
      try {
        const text = await http.filesystemRequest(data)
        logDebug('configStore.sendFilesystemRequest()', text)
        return { success: true, text }
      } catch (err) {
        logError('configStore.sendFilesystemRequest()', err)
        return { success: false, text: '' }
      }
    },
    async runPushTest(data) {
      global.disabled = true
      const started = await this.sendPushTest(data)
      if (!started) {
        global.messageError = 'Failed to start push test'
        global.disabled = false
        return { success: false }
      }

      const wait = (ms) => new Promise((res) => setTimeout(res, ms))

      while (true) {
        await wait(2000)
        const resp = await this.getPushTestStatus()
        if (!resp.success) {
          global.disabled = false
          global.messageError = 'Failed to get push test status'
          return { success: false }
        }

        const d = resp.data
        if (d.status) {
          // still running
          continue
        }

        global.disabled = false
        if (!d.push_enabled) {
          global.messageWarning = 'No endpoint is defined for this target. Cannot run test.'
        } else if (!d.success) {
          global.messageError = 'Test failed with error code ' + getErrorString(d.last_error)
        } else {
          global.messageSuccess = 'Test was successful'
        }

        return { success: true }
      }
    },
    async runWifiScan() {
      global.disabled = true
      const started = await this.sendWifiScan()
      if (!started) {
        global.disabled = false
        global.messageError = 'Failed to start wifi scan'
        return { success: false }
      }

      const wait = (ms) => new Promise((res) => setTimeout(res, ms))

      while (true) {
        await wait(2000)
        const resp = await this.getWifiScanStatus()
        if (!resp.success) {
          global.disabled = false
          global.messageError = 'Failed to get wifi scan status'
          return { success: false, data: null }
        }

        const d = resp.data
        if (d.status) {
          continue
        }

        global.disabled = false
        return { success: d.success, data: d }
      }
    },
    async runHardwareScan() {
      global.disabled = true
      const started = await this.sendHardwareScan()
      if (!started) {
        global.disabled = false
        global.messageError = 'Failed to start hardware scan'
        return { success: false }
      }

      const wait = (ms) => new Promise((res) => setTimeout(res, ms))

      while (true) {
        await wait(2000)
        const resp = await this.getHardwareScanStatus()
        if (!resp.success) {
          global.disabled = false
          global.messageError = 'Failed to get hardware scan status'
          return { success: false, data: null }
        }

        const d = resp.data
        if (d.status) {
          continue
        }

        global.disabled = false
        return { success: d.success, data: d }
      }
    }
  }
})
