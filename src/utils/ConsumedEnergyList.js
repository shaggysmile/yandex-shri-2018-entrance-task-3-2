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
   * @param {Object} device
   * @param {Number} cost
   */
  add (device, cost) {
    this.devices[device.id] = this.calcCostPower(cost, device.power)
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
