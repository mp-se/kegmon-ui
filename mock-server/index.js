const express = require('express')
var cors = require('cors')

const multer  = require('multer');
const upload = multer({ dest: "./" });

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.post('/api/firmware', upload.single('file'), function(req, res) {
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

configData = {
  // Device configuration
  id: "7376ef",
  mdns: "tap2",
  temp_format: "C",
  weight_unit: "kg",
  volume_unit: "cl",
  dark_mode: true, 
  // Hardware
  ota_url: "https://www.gravitymon.com/firmware/",
  display_layout: 0,
  temp_sensor: 0,
  brewpi_url: "http://192.168.0.23",
  scale_sensor: 0,
  display_driver: 0,
  pin_display_data: 33,
  pin_display_clock: 35,
  pin_scale1_data: 18,
  pin_scale1_clock: 16,
  pin_scale2_data: 7,
  pin_scale2_clock: 12,
  pin_temp_data: 11,
  pin_temp_power: 9,
  scale_deviation_increase: 1,
  scale_deviation_decrease: 0.1,
  scale_deviation_kalman: 0.05,
  scale_read_count: 5,
  scale_read_count_calibration: 30,
  scale_stable_count: 10,
  // Wifi
  wifi_portal_timeout: 120,
  wifi_connect_timeout: 20,
  wifi_ssid: "network A",
  wifi_ssid2: "",
  wifi_pass: "password",
  wifi_pass2: "mypass",
  // Push _ Generic
  push_timeout: 10,  
  brewfather_apikey: "NipSwcZmguYM4bvuFReRtgAddesRbQkyYMFin7cIGybf4htng61oA5",
  brewfather_userkey: "Urz3aoQ5KJhaH8883DIXWZlUoHpG42",
  brewspy_token1: "",
  brewspy_token2: "",
  // Push _ Http Post 1
  http_post_target: "http://192.168.1.10:9090/api/v1/ZYfjlUNeiuyu9N/telemetry",
  http_post_header1: "Auth: Basic T7IF9DD9fF3RDddE=",
  http_post_header2: "Auth: Advanced T7IF9DD9fF3RDddE=",
  // Push - Http Post 2
  http_post2_target: "http://192.168.1.10/ispindel",
  http_post2_header1: "Header: Second",
  http_post2_header2: "Header: First",
  // Push - Http Get
  http_get_target: "http://192.168.1.10/ispindel",
  http_get_header1: "Header: Fourth",
  http_get_header2: "Header: Fifth",
  // Push - Influx
  influxdb2_target: "http://192.168.1.10:8086",
  influxdb2_org: "hello",
  influxdb2_bucket: "spann",
  influxdb2_token: "OijkU((jhfkh",
  // Push - MQTT
  mqtt_target: "192.168.1.20",
  mqtt_port: 1883,
  mqtt_user: "kegmon",
  mqtt_pass: "testpass",
  // Keg 1
  scale_temp_formula1: "",
  scale_factor1: -21648.68945,
  scale_offset1: 26689,
  keg_weight1: 5,
  keg_volume1: 19,
  glass_volume1: 0.4,
  beer_name1: "West Coast IPA",
  beer_abv1: 7,
  beer_fg1: 1.01,
  beer_ebc1: 5,
  beer_ibu1: 26,
  // Keg 2
  scale_temp_formula2: "",
  scale_factor2: -23080.98438,
  scale_offset2: -108721,
  keg_weight2: 5,
  keg_volume2: 19,
  glass_volume2: 0.4,
  beer_name2: "Helles Festbier",
  beer_abv2: 5.5,
  beer_fg2: 1.01,
  beer_ebc2: 5,
  beer_ibu2: 28,
}
statusData = {
  scale_factor1: -21648.68945,
  scale_factor2: -23080.98438,
  scale_weight1: 16.39,
  scale_raw1: 0,
  scale_offset1: 26689,
  beer_weight1: 11.37,
  beer_volume1: 1126,
  scale_weight2: 0.19,
  scale_raw2: 0,
  scale_offset2: -108721,
  beer_weight2: -4.81,
  beer_volume2: -476,
  scale_stable_weight1: 16.27,
  scale_stable_weight2: 0.24,
  last_pour_weight1: 0.11,
  last_pour_volume1: 11,
  last_pour_weight2: 14.01,
  last_pour_volume2: 1387,
  mdns: "tap2",
  id: "7376ef",
  wifi_ssid: "@home",
  platform: "esp32s2",
  app_ver: "0.8.0",
  app_build: "..acc498",
  weight_unit: "kg",
  volume_unit: "cl",
  temp_format: "C",
  temp: 22.4,
  rssi: -76,
  glass1: 27.9,
  glass2: 0,
  keg_volume1: 1900,
  keg_volume2: 1900,
  total_heap: 1000,
  free_heap: 500,
  ip: "192.0.0.1",
  wifi_setup: false,
}

app.get('/api/auth', (req, res) => {
  console.log('GET: /api/auth')
  /* 
   * Description:    Perform device authentication and receive access token
   * Authentication: No
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  data = { token: statusData.id }

  console.log(req.headers['authorization'])
  res.send(data)
})

app.get('/api/config', (req, res) => {
  console.log('GET: /api/config')
  /* 
   * Description:    Return configuration data as json document. 
   * Authentication: Required
   * Limitation:     Don't include format templates due to their size.
   *                 Wifi passwords are removed due to security considerations (no encrypted transfer).
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(configData)
})

app.get('/api/restart', (req, res) => {
  console.log('GET: /api/restart')
  /* 
   * Description:    Perform a restart of the device
   * Authentication: Required
   * Limitation:     - 
   * Note:           Simulator will wait 2 seconds before returning result.
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      status: true,
      success: true,
      message: "Device is restarting..."
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

/*
var calibrateRunning = false

app.get('/api/calibrate', (req, res) => {
  console.log('GET: /api/calibrate')
  /* 
   * Description:    Initiate the gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/calibrate/status to check for completion
   * Return:         200 OK, 401 Access Denied
   *
  configData.gyro_calibration_data.gx = 1
  setTimeout(() => { calibrateRunning = false }, 5000)
  calibrateRunning = true
  var data = {
    success: true,
    message: "Gyro calibration started..."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/calibrate/status', (req, res) => {
  console.log('GET: /api/calibrate/status')
  /* 
   * Description:    Return status of the current gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   *
  var data = {}
  if (calibrateRunning) {
    data = {
      status: calibrateRunning,
      success: false,
      message: "Gyro calibration running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Gyro calibration completed..."
    }
  }
  res.type('application/json')
  res.send(data)
})*/

var testRunning = false

app.post('/api/push', (req, res) => {
  console.log('GET: /api/push')
  /* 
   * Description:    Initiate the push test for a defined target
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/test/push/status to check for completion
   * Return:         200 OK, 401 Access Denied, 422 Content Invalid
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  if(!req.body.hasOwnProperty("push_format")) {
    res.sendStatus(422)
    return
  }  
  testRunning = true
  setTimeout(() => { testRunning = false }, 5000)
  var data = {
    success: true,
    message: "Test scheduled."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/push/status', (req, res) => {
  console.log('GET: /api/push/status')
  /* 
   * Description:    Return status of the current gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (testRunning) {
    data = {
      status: testRunning,
      success: false,
      message: "Push test running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Push test completed...",
      push_return_code: 200,
      push_enabled: true
    }
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/factory', (req, res) => {
  console.log('GET: /api/factory')
  /* 
   * Description:    Simualate a factory reset.
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      success: true,
      message: "Factory settings restored"
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

/*app.get('/api/formula', (req, res) => {
  console.log('GET: /api/formula')
  /* 
   * Description:    Simualate creation of gravity formula. Assume data has been saved via config.
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   *
  setTimeout(() => {
    var data = {
      success: true,
      message: "Hello world",
      gravity_formula: "0.0*tilt^3+0.0*tilt^2+0.0017978*tilt+0.9436"
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

app.get('/api/format', (req, res) => {
  console.log('GET: /api/format')
  /* 
   * Description:    Return format data as json document. 
   * Authentication: Required
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   *
  res.type('application/json')
  res.send(formatData)
})*/

app.get('/api/status', (req, res) => {
  console.log('GET: /api/status')
  /* 
   * Description:    Return status data as json document. 
   * Authentication: None
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(statusData)
})

app.post('/api/config', (req, res) => {
  console.log('POST: /api/config')
  /* 
   * Description:    Update the configuration data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See config read for options.
   * Return:         200 OK, 401 Access Denied
   */
  console.log(req.body);
  for (var o in req.body) {
    configData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Configuration stored",
  }
  res.type('application/json')
  res.send(data)
})

/*app.post('/api/format', (req, res) => {
  console.log('POST: /api/format')
  /* 
   * Description:    Update the format data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See format read for options.
   * Return:         200 OK, 401 Access Denied
   *
  console.log(req.body);
  for (var o in req.body) {
    formatData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Format stored",
  }
  res.type('application/json')
  res.send(data)
})*/

app.get('/levels', (req, res) => {
  console.log('GET: /levels')

  var levels = "2024-07-11 13:12:07;nan;16.587868;nan;nan\n\
2024-07-11 13:30:14;nan;16.488798;nan;0.099069 \n\
2024-07-11 13:30:15;nan;16.488798;nan;nan\n\
2024-07-11 14:01:24;nan;16.291916;nan;0.196884\n\
2024-07-11 14:01:24;nan;16.291916;nan;nan\n\
2024-07-11 17:22:55;nan;16.192898;nan;0.099018\n\
2024-07-11 17:22:55;nan;16.192898;nan;nan\n\
2024-07-11 19:34:53;nan;15.863690;nan;0.329206\n\
2024-07-11 19:34:53;nan;15.863690;nan;nan\n\
2024-07-11 22:14:11;nan;15.768347;nan;0.190148\n\
2024-07-11 22:14:11;nan;15.768347;nan;nan\n\
2024-07-11 22:17:53;nan;15.668524;nan;0.099822\n\
2024-07-11 22:17:53;nan;15.668524;nan;nan\n\
2024-07-11 22:19:23;nan;15.539115;nan;0.129409\n\
2024-07-11 22:19:24;nan;15.539115;nan;nan\n\
2024-07-12 00:03:40;8.623783;nan;nan;nan\n\
2024-07-12 00:03:40;nan;15.826628;nan;nan\n\
2024-07-12 01:48:25;nan;15.726063;nan;0.100565\n\
2024-07-12 01:48:26;nan;15.726063;nan;nan\n\
2024-07-12 01:50:02;nan;15.582197;nan;0.143866\n\
2024-07-12 01:50:02;nan;15.582197;nan;nan\n\
2024-07-12 05:12:30;nan;15.482185;nan;0.100012\n\
2024-07-12 05:12:30;nan;15.482185;nan;nan\n\
2024-07-12 23:25:21;8.524719;nan;0.099064;nan\n\
2024-07-12 23:25:21;8.524719;nan;nan;nan\n\
2024-07-14 04:58:30;8.670466;nan;nan;nan\n\
2024-07-14 04:58:30;nan;16.128782;nan;nan\n\
2024-07-14 05:07:22;nan;15.972906;nan;0.155876\n\
2024-07-14 05:07:22;nan;15.972906;nan;nan\n\
2024-07-14 05:11:04;nan;15.788408;nan;0.184498\n\
2024-07-14 05:11:05;nan;15.788408;nan;nan\n\
2024-07-14 05:17:51;nan;15.688248;nan;0.100161\n\
2024-07-14 05:17:51;nan;15.688248;nan;nan\n\
2024-07-14 19:57:58;8.662101;nan;nan;nan\n\
2024-07-14 19:57:59;nan;16.060747;nan;nan\n\
2024-07-14 20:34:13;nan;15.960558;nan;0.100189\n\
2024-07-14 20:34:13;nan;15.960558;nan;nan\n\
2024-07-14 20:36:31;nan;15.815523;nan;0.145035\n\
2024-07-14 20:36:31;nan;15.815523;nan;nan\n\
2024-07-14 20:40:11;nan;15.715315;nan;0.100208\n\
2024-07-14 20:40:11;nan;15.715315;nan;nan\n\
2024-07-15 09:53:54;nan;15.615223;nan;0.100092\n\
2024-07-15 09:53:54;nan;15.615223;nan;nan\n\
2024-07-16 14:37:44;nan;15.156647;nan;0.458576\n\
2024-07-16 14:37:45;nan;15.156647;nan;nan"
  res.send(levels)
})

var wifiScanRunning = false

app.get('/api/wifi', (req, res) => {
  console.log('GET: /api/wifi')
  /* 
   * Description:    Do a wifi scan for avaialble networks
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/wifi/scan/status to check for completion
   * Return:         200 OK, 401 Access Denied
   */
  wifiScanRunning = true
  setTimeout(() => { wifiScanRunning = false }, 3000)
  var data = {
    success: true,
    message: "Wifi scan started."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/wifi/status', (req, res) => {
  console.log('GET: /api/wifi/status')
  /* 
   * Description:    Return status of the current wifi scan process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (wifiScanRunning) {
    data = {
      status: wifiScanRunning,
      success: false,
      message: "Wifi scan running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Wifi scan completed...",
      networks: [ 
        { wifi_ssid: "network A", rssi: -20, channel: 10, encryption: 2 }, 
        { wifi_ssid: "network B", rssi: -70, channel: 12, encryption: 3 }, 
        { wifi_ssid: "network C", rssi: -50, channel: 6, encryption: 0 }
      ]
    }
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/ping', (req, res) => {
  console.log('GET: /api/ping')

  res.type('application/json')
  res.send("{}")
})

/*app.get('/log', (req, res) => {
  console.log('GET: /log')

  setTimeout(() => {
    res.send("Log entry 5\nLog entry 4\nLog entry 3\nLog entry 2\nLog entry 1\n")
  }, 1000)
})

app.get('/log2', (req, res) => {
  console.log('GET: /log2')
  setTimeout(() => {
    res.send("Log entry 9\nLog entry 8\nLog entry 7\nLog entry 6\n")
  }, 1000)
})*/

app.post('/api/filesystem', (req, res) => {
  console.log('POST: /api/filesystem')
  /* 
   * Description:    Interact with local file system on the device
   * Authentication: Required
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied, 400 Faulty request
   * Request body:
     {
       command: "dir|get|del",
       file: "name of file for get and del"
     }
   */
  console.log("Command:", req.body.command)
  
  if(req.body.command == "dir") {
    var data = { 
      total: 1000,
      used: 900,
      free: 100,
      files: [
        { file: "/error.log", size: 10 },
        { file: "/error2.log", size: 10 },
      ]
    }
    res.type('application/json')
    res.send(data)
    return
  }
  else if(req.body.command == "del") {
    console.log(req.body.file)
    setTimeout(() => {
      res.sendStatus(200)
    }, 2000)
    return
  } else if(req.body.command == "get") {
    console.log(req.body.file)
    if(req.body.file == "/error.log") {
      setTimeout(() => {
        res.send("Log entry 5\nLog entry 4\nLog entry 3\nLog entry 2\nLog entry 1\n")
      }, 1000)
    } else if(req.body.file == "/error2.log") {
      setTimeout(() => {
        res.send("Log entry 9\nLog entry 8\nLog entry 7\nLog entry 6\n")
      }, 1000)
    } 
    return
  } 

  res.sendStatus(400)
})

app.listen(port, () => {
  console.log(`Kegmon API simulator port ${port}`)
})