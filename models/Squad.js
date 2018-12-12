import { Model } from '@vuex-orm/core'

export default class Squad extends Model {
  static entity = 'squads'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      team_id: this.number(0),

      // Database fields
      name: this.string(''),
      players_list: this.attr([]),
      positions_list: this.attr([])
    }
  }
}