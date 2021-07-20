import { Model } from '@vuex-orm/core'
import Fixture from './Fixture'
import TableRow from './TableRow'

export default class Stage extends Model {
  static entity = 'Stage'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      competitionId: this.number(0),

      // Database fields
      name: this.string(''),
      numTeams: this.number(0),
      numFixtures: this.number(0),
      table: this.boolean(false),

      // Associations
      fixtures: this.hasMany(Fixture, 'stageId'),
      tableRows: this.hasMany(TableRow, 'stageId')
    }
  }
}
