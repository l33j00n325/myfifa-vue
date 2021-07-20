<template>
  <v-card
    flat
    class="mt-2"
  >
    <v-card-title>
      <v-btn-toggle
        v-model="mode"
        rounded
        mandatory
        class="mx-3"
      >
        <v-btn
          v-for="(opt, i) in modes"
          :key="i"
          text
        >
          <v-icon :color="opt.color">{{ opt.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>
      <div :class="`subheading ${currentMode.color}--text`">
        {{ currentMode.text }}
      </div>
      <v-spacer />
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      />
    </v-card-title>

    <!-- Player Information Grid -->
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="rows"
        :search="search"
        sort-by="pos"
        item-key="id"
        :mobile-breakpoint="0"
        no-data-text="No Players Recorded"
      >
        <template #item.name="{ item }">
          <v-btn
            :to="item.link"
            nuxt
            small
            text
            color="primary"
            class="text-capitalize"
          >
            {{ item.name }}
          </v-btn>
        </template>
        <template #item.ovrChange="{ item }">
          <span :class="ovrColor(item)">
            {{ item.ovrChange > 0 ? '+' : '' }}{{ item.ovrChange }}
          </span>
        </template>
        <template #item.endValue="{ item }">
          {{ item.endValue | formatMoney(team.currency) }}
        </template>
        <template #item.valueChange="{ item }">
          <span :class="valueColor(item)">
            {{ item.valueChange.toFixed(2) }}%
          </span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { positions } from '@/constants'

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }

  export default {
    name: 'SeasonPlayerGrid',
    props: {
      season: { type: Number, required: true },
      playerPerformanceStats: { type: Array, required: true },
      playerDevelopmentStats: { type: Array, required: true }
    },
    data: () => ({
      mode: 0,
      modes: [
        { text: 'Growth', color: 'green', icon: 'mdi-trending-up' },
        { text: 'Statistics', color: 'red', icon: 'mdi-numeric' }
      ],
      search: null
    }),
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      },
      currentMode () {
        return this.modes[this.mode]
      },
      headers () {
        let headers = [
          { text: 'Name', value: 'name', width: 200, class: 'stick-left', cellClass: 'stick-left' },
          { text: 'Pos', value: 'pos', align: 'center', sort: sortPos },
          { text: 'Age', value: 'age', align: 'center' }
        ]

        switch (this.mode) {
          case 0: // Growth
            return headers.concat([
              { text: 'OVR', value: 'endOvr', align: 'center' },
              { text: 'OVR Change', value: 'ovrChange', align: 'center' },
              { text: 'Value', value: 'endValue', align: 'end', class: 'text-right', cellClass: 'text-right' },
              { text: 'Value Change', value: 'valueChange', align: 'end', class: 'text-right', cellClass: 'text-right' }
            ])
          case 1: // Statistics
            return headers.concat([
              { text: 'Games Played', value: 'numMatches', align: 'end', class: 'text-right', cellClass: 'text-right' },
              { text: 'Minutes', value: 'numMinutes', align: 'end', class: 'text-right', cellClass: 'text-right' },
              { text: 'Goals', value: 'numGoals', align: 'end', class: 'text-right', cellClass: 'text-right' },
              { text: 'Assists', value: 'numAssists', align: 'end', class: 'text-right', cellClass: 'text-right' },
              { text: 'Clean Sheets', value: 'numCleanSheets', align: 'end', class: 'text-right', cellClass: 'text-right' }
            ])
          default:
            return headers
        }
      },
      rows () {
        return this.playerDevelopmentStats.map(stats => {
          const player = this.$store.$db().model('Player').find(stats.playerId)

          const startOvr = stats.ovr[0]
          const startValue = stats.value[0]
          const endOvr = stats.ovr[1]
          const endValue = stats.value[1]

          const ovrChange = endOvr - startOvr
          const valueChange = (endValue - startValue) / startValue * 100

          const matchStats = this.playerPerformanceStats.reduce((totalStats, data) => {
            if (data.playerId === stats.playerId) {
              ['Matches', 'Minutes', 'Goals', 'Assists', 'CleanSheets'].forEach(metric => {
                totalStats[`num${metric}`] += data[`num${metric}`]
              })
            }
            return totalStats
          }, {
            numMatches: 0,
            numMinutes: 0,
            numGoals: 0,
            numAssists: 0,
            numCleanSheets: 0
          })

          return {
            ...player,
            ...matchStats,
            link: player.link,
            age: player.age - (this.team.season - this.season),
            endOvr,
            endValue,
            ovrChange,
            valueChange
          }
        })
      }
    },
    methods: {
      ovrColor (player) {
        switch (true) {
          case player.ovrChange > 6:
            return 'green--text text--darken-2'
          case player.ovrChange > 4:
            return 'green--text'
          case player.ovrChange > 2:
            return 'light-green--text text--darken-2'
          case player.ovrChange > 0:
            return 'light-green--text'
          case player.ovrChange < -2:
            return 'red--text'
          case player.ovrChange < 0:
            return 'orange--text'
          default:
            return 'grey--text'
        }
      },
      valueColor (player) {
        switch (true) {
          case player.valueChange > 100:
            return 'green--text text--darken-2'
          case player.valueChange > 50:
            return 'green--text'
          case player.valueChange > 25:
            return 'light-green--text text--darken-2'
          case player.valueChange > 0:
            return 'light-green--text'
          case player.valueChange < -25:
            return 'red--text'
          case player.valueChange < 0:
            return 'orange--text'
          default:
            return 'grey--text'
        }
      }
    }
  }
</script>
