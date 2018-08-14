
import ConsumedEnergyList from './utils/ConsumedEnergyList'
import ScheduleList from './utils/ScheduleList'

/** Class calc optimal device schedule by energy cost and power */
export default class EnergyCost {
  static get DAY_HOURS () {
    return 24
  }
  /**
   * Create a energy cost.
   * @param {Array} devices
   * @param {Array} rates
   * @param {Number} maxPower
   */
  constructor ({devices, rates, maxPower}) {
    this.devices = devices
    this.rates = rates
    this._maxPower = maxPower
    this.scheduleList = new ScheduleList()
    this.consumedEnergyList = new ConsumedEnergyList()
  }
  calcSchedule () {
    this.devices.forEach(device => {
      let {sequence, cost} = this.getSequence(device)
      if (sequence && cost) {
        for (let i = sequence; i < sequence + device.duration; i++) {
          this.scheduleList.add(i, device.id)
          this.consumedEnergyList.add(device, cost)
        }
      }
    })
  }
  getSequence (device) {
    let sequence = null
    let cost = Number.POSITIVE_INFINITY
    let offsetHour, startHour, endHour
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
        if (this.isEnoughPower(i, device.duration)) {
          cost = hourCost
          sequence = (i + offsetHour) % EnergyCost.DAY_HOURS
        }
      };
    }
    return {
      sequence,
      cost
    }
  }
  isEnoughPower (i, duration) {
    let isEnoughPower = true
    for (let j = i; j < i + duration; j++) {
      let power = 0
      this.scheduleList.list[i].forEach(deviceId => {
        power += this.devices.find(device => device.id === deviceId).power
      })
      if (power > this._maxPower) {
        isEnoughPower = false
      }
    }
    return isEnoughPower
  }
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
  get devices () {
    return this._devices.sort((a, b) => {
      return parseInt(a.duration) - parseInt(b.duration)
    })
  }
  set rates (rates) {
    this._rates = rates
  }
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
}
