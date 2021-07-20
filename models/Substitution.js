import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Substitution extends Model {
  static entity = 'Substitution'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      matchId: this.number(0),
      playerId: this.number(0),
      replacementId: this.number(0),

      // Database fields
      playerName: this.string(''),
      replacedBy: this.string(''),
      minute: this.number(0),
      injury: this.boolean(false),
      createdAt: this.string(''),

      // Calculated fields
      home: this.boolean(true),

      // Associations
      replacement: this.belongsTo(Player, 'replacementId', 'id')
    }
  }

  get type () {
    return 'substitution'
  }
}
