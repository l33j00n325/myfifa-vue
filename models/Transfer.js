import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Transfer extends Model {
  static entity = 'Transfer'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      signedOn: this.string(''),
      movedOn: this.string(''),
      origin: this.string(''),
      destination: this.string(''),
      fee: this.number(null).nullable(),
      tradedPlayer: this.string(null).nullable(),
      addonClause: this.number(null).nullable(),

      // Associations
      player: this.belongsTo(Player, 'playerId', 'id')
    }
  }

  get date () {
    return this.movedOn
  }

  get type () {
    return 'transfer'
  }
}
