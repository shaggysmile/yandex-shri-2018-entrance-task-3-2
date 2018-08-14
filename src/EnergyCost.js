import ConsumedEnergyList from './utils/ConsumedEnergyList'
import ScheduleList from './utils/ScheduleList'

/** Class for calc optimal device schedule by energy cost and power */
export default class EnergyCost {
  /**
   * Init a energy cost.
   * @param {Array} devices
   * @param {Array} rates
   * @param {Number} maxPower
   */
  constructor ({devices, rates, maxPower}) {
    this.devices = devices
    this.rates = rates
    this.maxPower = maxPower
    this.scheduleList = new ScheduleList()
    this.consumedEnergyList = new ConsumedEnergyList()
  }
  /**
   * Start calc schedule.
   * @param {Object} device
   * @param {Number} cost
   */
  calcSchedule () {
    this.devices.forEach(device => {
      let {sequence, cost} = this.getSequence(device)
      if (sequence && cost) {
        for (let hour = sequence; hour < sequence + device.duration; hour++) {
          this.scheduleList.add(device.id, hour)
          this.consumedEnergyList.add(device.id, device.power, cost)
        }
      }
    })
  }
  /**
   * Get best sequence.
   * @param {Object} device
   * @return {Object}
   */
  getSequence (device) {
    let sequence = null
    let cost = Number.POSITIVE_INFINITY
    let offsetHour, startHour, endHour
    // calc offsets
    switch (device.mode) {
      case 'day':
        offsetHour = 0
        startHour = 7
        endHour = 21 - device.duration
        break
      case 'night':
        offsetHour = 7
        startHour = 21 - offsetHour
        endHour = EnergyCost.DAY_HOURS - device.duration
        break
      default:
        offsetHour = 0
        startHour = 12
        endHour = EnergyCost.DAY_HOURS
    }
    for (let i = startHour; i < endHour; i++) {
      let hourCost = 0
      for (let j = 0; j < device.duration; j++) {
        hourCost += this.rates[(i + j + offsetHour) % EnergyCost.DAY_HOURS]
      }
      if (cost > hourCost) {
        cost = hourCost
        sequence = (i + offsetHour) % EnergyCost.DAY_HOURS
      }
    }
    return {
      sequence,
      cost
    }
  }
  /**
   * Output final schedule.
   * @param {Mumber} i - index of hour
   * @param {Number} duration - device duraion
   * @param {Boolean}
   */
  output () {
    this.calcSchedule()
    return {
      'schedule': this.scheduleList.list,
      'consumedEnergy': {
        devices: this.consumedEnergyList.devices,
        value: this.consumedEnergyList.totalSum
      }
    }
  }
  set devices (devices) {
    this._devices = devices
  }
  /**
   * Get sorted devices by duration.
   */
  get devices () {
    return this._devices.sort((a, b) => {
      return parseInt(a.duration) - parseInt(b.duration)
    })
  }
  set rates (rates) {
    this._rates = rates
  }
  /**
   * Get hours rates.
   */
  get rates () {
    let hours = new Array(EnergyCost.DAY_HOURS)
    this._rates.forEach(rate => {
      let hourOffset = 0
      let rateEndHour = rate.to
      if (rate.from > rate.to) {
        hourOffset = rate.to
        rateEndHour = EnergyCost.DAY_HOURS
      }
      for (let i = rate.from - hourOffset; i < rateEndHour; i++) {
        hours[(i + hourOffset) % EnergyCost.DAY_HOURS] = rate.value
      }
    })
    return hours
  }
  /**
   * Get day hours.
   * @static
   */
  static get DAY_HOURS () {
    return 24
  }
}
