/** Class create and map consumed energy list. */
export default class ConsumedEnergyList {
  /**
   * Create a consumed energy list.
   */
  constructor () {
    /** @private {Object} */
    this.devices = {}
  }
  /**
   * Add device to list
   * @param {String} deviceId
   * @param {Number} devicePower
   * @param {Number} cost
   */
  add (deviceId, devicePower, cost) {
    this.devices[deviceId] = this.calcCostPower(cost, devicePower)
  }
  /**
   * Calc cost by power
   *
   * @param {Number} cost
   * @param {Number} power
   * @return {Number}
   */
  calcCostPower (cost, power) {
    return parseFloat((cost * power / 1000).toFixed(4))
  }

  /**
   * Get sum power cost of devices.
   *
   * @return {Number}
   */
  get totalSum () {
    return parseFloat(Object.values(this.devices).reduce((current, prev) => {
      return current + prev
    }, 0).toFixed(3))
  }
}
