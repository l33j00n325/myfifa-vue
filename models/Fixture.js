import { Model } from '@vuex-orm/core'
import FixtureLeg from './FixtureLeg'

export default class Fixture extends Model {
  static entity = 'Fixture'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      stageId: this.number(0),

      // Database fields
      homeTeam: this.string('').nullable(),
      awayTeam: this.string('').nullable(),

      // Associations
      legs: this.hasMany(FixtureLeg, 'fixtureId', 'id')
    }
  }
}
