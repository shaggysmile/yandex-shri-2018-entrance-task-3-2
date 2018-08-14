/** Class create and map consumed energy list. */
export default class ScheduleList {
  static get DAY_HOURS () {
    return 24
  }
  /**
   * Create a schedule list.
   */
  constructor () {
    this.list = {}
    this.fill()
  }
  /**
   * Fill schedule list. Every index of item equal day hour
   */
  fill () {
    for (let i = 0; i < ScheduleList.DAY_HOURS; i++) {
      this.list[i] = []
    }
  }
  /**
   * Add device to list
   * @param {Number} hour
   * @param {String} deviceId
   */
  add (hour, deviceId) {
    this.list[hour % ScheduleList.DAY_HOURS].push(deviceId)
    return this.list
  }
}
