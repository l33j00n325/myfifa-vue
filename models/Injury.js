import { Model } from '@vuex-orm/core'

export default class Injury extends Model {
  static entity = 'Injury'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      startedOn: this.string(''),
      endedOn: this.string('').nullable(),
      description: this.string('')
    }
  }

  get date () {
    return this.startedOn
  }

  get type () {
    return 'injury'
  }
}
