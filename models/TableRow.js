import { Model } from '@vuex-orm/core'

export default class TableRow extends Model {
  static entity = 'TableRow'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      stageId: this.number(0),

      // Database fields
      name: this.string('').nullable(),
      wins: this.number(null).nullable(),
      draws: this.number(null).nullable(),
      losses: this.number(null).nullable(),
      goalsFor: this.number(null).nullable(),
      goalsAgainst: this.number(null).nullable(),

      // Calculated fields
      goalDifference: this.number(null).nullable(),
      points: this.number(null).nullable()
    }
  }
}
