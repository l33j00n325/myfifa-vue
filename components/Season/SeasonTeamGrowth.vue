<template>
  <delta-statistic
    :label="label"
    :formatter="formatter"
    :start-value="startValue"
    :end-value="endValue"
  />
</template>

<script>
  import { mapGetters } from 'vuex'
  import { sum } from '@/functions'

  export default {
    name: 'SeasonTeamGrowth',
    props: {
      attribute: { type: String, required: true },
      label: { type: String, required: true },
      average: { type: Boolean, default: false },
      formatter: { type: Function, default: x => x },
      seasonStart: { type: String, default: null },
      seasonEnd: { type: String, default: null }
    },
    computed: {
      ...mapGetters('teams', {
        getTeam: 'get'
      }),
      team () {
        return this.getTeam(this.$route.params.teamId)
      },
      contractsAtStart () {
        return this.$store.$db().model('Contract')
          .query()
          .where(contract =>
            contract.startedOn <= this.seasonStart &&
            this.seasonStart < contract.endedOn
          )
          .get()
      },
      playersAtStart () {
        return this.$store.$db().model('Player')
          .query()
          .with('histories')
          .where('teamId', this.team.id)
          .whereIdIn(this.contractsAtStart.map(contract => contract.playerId))
          .get()
      },
      contractsAtEnd () {
        return this.$store.$db().model('Contract')
          .query()
          .where(contract =>
            contract.startedOn <= this.seasonEnd &&
            this.seasonEnd < contract.endedOn
          )
          .get()
      },
      playersAtEnd () {
        return this.$store.$db().model('Player')
          .query()
          .with('histories')
          .where('teamId', this.team.id)
          .whereIdIn(this.contractsAtEnd.map(contract => contract.playerId))
          .get()
      },
      startValue () {
        const total = sum(
          this.playersAtStart.map(player =>
            player.recordAt(this.seasonStart)[this.attribute]
          )
        )
        return this.average ? total / this.playersAtStart.length : total
      },
      endValue () {
        const total = sum(
          this.playersAtEnd.map(player =>
            player.recordAt(this.seasonEnd)[this.attribute]
          )
        )
        return this.average ? total / this.playersAtEnd.length : total
      },
      color () {
        return this.startValue < this.endValue ? 'green' : 'red'
      },
      icon () {
        return this.startValue < this.endValue ? 'menu-up' : 'menu-down'
      },
      percentage () {
        return Math.abs((this.endValue - this.startValue) / this.startValue) * 100
      }
    }
  }
</script>
