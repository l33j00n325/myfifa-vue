import { Model } from '@vuex-orm/core'

export default class PlayerHistory extends Model {
  static entity = 'PlayerHistory'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      recordedOn: this.string(''),
      ovr: this.number(60),
      value: this.number(0),
      kitNo: this.number(0).nullable()
    }
  }
}
