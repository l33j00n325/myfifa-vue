<template>
  <base-line-chart
    :chart-data="chartData"
    :color="color"
    :min="min"
    :max="max"
    :prefix="prefix"
    :ratio="ratio"
    show-area
    :tooltip-x-modifier="x => formatDate(x)"
    :axis-x="dateAxis"
  />
</template>

<script>
  import { mapGetters } from 'vuex'
  import { format, parseISO } from 'date-fns'

  export default {
    name: 'PlayerHistoryChart',
    props: {
      player: { type: Object, required: true },
      attribute: { type: String, required: true },
      color: { type: String, default: '#d70206' },
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      prefix: { type: String, default: null },
      ratio: { type: String, default: 'ct-major-tenth' }
    },
    computed: {
      ...mapGetters('teams', {
        getTeam: 'get'
      }),
      team () {
        return this.getTeam(this.$route.params.teamId)
      },
      lastContract () {
        return this.$store.$db().model('Contract')
          .query()
          .orderBy('endedOn')
          .where('playerId', this.player.id)
          .last()
      },
      lastDate () {
        const contractEnd = this.lastContract && this.lastContract.endedOn
        return contractEnd && this.team.currentlyOn >= contractEnd
          ? contractEnd
          : this.team.currentlyOn
      },
      chartData () {
        let series = []

        series.push({
          data: this.player.histories.reduce((data, history) => {
            data.splice(-1, 0, {
              x: parseISO(history.recordedOn),
              y: history[this.attribute]
            })
            return data
          }, [
            {
              x: parseISO(this.lastDate),
              y: this.player[this.attribute]
            }
          ])
        })

        return { series }
      },
      dateAxis () {
        return {
          type: this.$chartist.FixedScaleAxis,
          divisor: 5,
          labelInterpolationFnc: value => format(value, 'MMM d, yyyy')
        }
      }
    },
    methods: {
      formatDate (date) {
        return format(date, 'MMM d, yyyy')
      }
    }
  }
</script>
