import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Contract extends Model {
  static entity = 'Contract'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      signedOn: this.string(''),
      wage: this.number(null).nullable(),
      signingBonus: this.number(null).nullable(),
      releaseClause: this.number(null).nullable(),
      performanceBonus: this.number(null).nullable(),
      bonusReq: this.number(null).nullable(),
      bonusReqType: this.string(null).nullable(),
      endedOn: this.string(''),
      startedOn: this.string(''),
      conclusion: this.string(null).nullable(),

      // Associations
      player: this.belongsTo(Player, 'playerId', 'id')
    }
  }

  get date () {
    return this.startedOn
  }

  get type () {
    return 'contract'
  }
}
