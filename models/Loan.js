import { Model } from '@vuex-orm/core'

export default class Loan extends Model {
  static entity = 'Loan'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      startedOn: this.string(''),
      signedOn: this.string(''),
      endedOn: this.string('').nullable(),
      origin: this.string(''),
      destination: this.string(''),
      wagePercentage: this.number(0).nullable()
    }
  }

  get date () {
    return this.startedOn
  }

  get type () {
    return 'loan'
  }
}
