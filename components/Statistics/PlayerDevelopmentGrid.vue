<template>
  <v-card>
    <v-toolbar flat>
      <v-menu>
        <template #activator="{ on }">
          <v-btn
            class="px-3"
            text
            v-on="on"
          >
            <v-icon
              left
              :color="currentFilter.color"
              v-text="`mdi-${currentFilter.icon}`"
            />
            <div
              :class="`text-capitalize ${currentFilter.color}--text`"
              v-text="`${currentFilter.text} Players`"
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(opt, i) in filters"
            :key="i"
            @click="filter = i"
          >
            <v-list-item-avatar>
              <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ opt.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-spacer />

      <v-menu>
        <template #activator="{ on }">
          <v-btn
            class="px-3"
            text
            v-on="on"
          >
            <v-icon
              left
              :color="currentMetric.color"
              v-text="`mdi-${currentMetric.icon}`"
            />
            <div
              :class="`text-capitalize ${currentMetric.color}--text`"
              v-text="currentMetric.text"
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(opt, i) in metrics"
            :key="i"
            @click="metric = i"
          >
            <v-list-item-avatar>
              <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ opt.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <!-- Player Information Grid -->
    <v-card-text>
      <client-only>
        <v-data-table
          :key="key"
          :headers="headers"
          :items="rows"
          item-key="id"
          sort-by="pos"
          :sort-desc.sync="sortDesc"
          must-sort
          no-data-text="No Players Found"
          :mobile-breakpoint="0"
        >
          <template #item="{ item }">
            <tr>
              <td class="stick-left">
                <v-btn
                  :to="item.link"
                  small
                  text
                  nuxt
                  color="info"
                  class="text-capitalize"
                  v-text="item.name"
                />
              </td>
              <td class="text-center">
                <flag
                  v-if="item.flag"
                  :iso="item.flag"
                  :title="item.nationality"
                  class="mr-2"
                />
              </td>
              <td class="text-center">{{ item.pos }}</td>
              <template v-if="metric === 0">
                <td class="text-right">{{ item.startOVR }}</td>
                <td
                  v-for="(_, season) in new Array(team.season + 1)"
                  :key="season"
                  :class="`text-right ${ovrColor(item.ovrDiff[season])}`"
                >
                  {{ item.ovrDiff[season] > 0 ? '+' : '' }}
                  {{ item.ovrDiff[season] }}
                </td>
                <td class="text-right">{{ item.ovr }}</td>
              </template>
              <template v-else>
                <td class="text-right">
                  {{ item.startValue | formatMoney(team.currency) }}
                </td>
                <td
                  v-for="(_, season) in new Array(team.season + 1)"
                  :key="season"
                  :class="`text-right ${valueColor(item.valueDiff[season])}`"
                >
                  <span v-if="item.valueDiff[season] !== undefined">
                    {{ item.valueDiff[season] > 0 ? '+' : '' }}
                    {{ item.valueDiff[season].toFixed(2) }}%
                  </span>
                </td>
                <td class="text-right">
                  {{ item.value | formatMoney(team.currency) }}
                </td>
              </template>
            </tr>
          </template>
        </v-data-table>
      </client-only>
    </v-card-text>
  </v-card>
</template>

<script>
  import groupBy from 'lodash.groupby'
  import { TeamAccessible } from '@/mixins'
  import { positions } from '@/constants'

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }

  export default {
    name: 'PlayerDevelopmentGrid',
    mixins: [
      TeamAccessible
    ],
    props: {
      stats: { type: Array, required: true }
    },
    data: () => ({
      key: 0,
      filter: 2,
      filters: [
        { text: 'All', color: 'blue', icon: 'earth' },
        { text: 'Youth', color: 'cyan', icon: 'school' },
        { text: 'Active', color: 'light-green', icon: 'account-check' }
      ],
      metric: 0,
      metrics: [
        { text: 'OVR', value: 'ovr', color: 'green', icon: 'trending-up' },
        { text: 'Value', value: 'value', color: 'red', icon: 'cash-multiple' }
      ],
      sortDesc: false
    }),
    computed: {
      currentFilter () {
        return this.filters[this.filter]
      },
      currentMetric () {
        return this.metrics[this.metric]
      },
      headers () {
        const headers = [
          { text: 'Name', value: 'name', width: 200, class: 'stick-left' },
          { text: 'Nationality', value: 'nationality', align: 'center', width: 120 },
          { text: 'Pos', value: 'pos', align: 'center', width: 100, sort: sortPos },
          {
            text: `Start ${this.currentMetric.text}`,
            value: `start${this.currentMetric.value}`,
            align: 'end',
            class: 'text-right',
            width: 120
          }
        ]

        for (let i = 0; i <= this.team.season; i++) {
          headers.push({
            text: this.seasonLabel(i),
            value: `${this.currentMetric.value}Diff.${i}`,
            align: 'end',
            class: 'text-right',
            width: 120,
            sort: this.sortNullLast
          })
        }

        headers.push({
          text: `Last ${this.currentMetric.text}`,
          value: this.currentMetric.value,
          align: 'end',
          class: 'text-right',
          width: 120
        })

        return headers
      },
      players () {
        return this.$store.$db().model('Player')
          .query()
          .where('teamId', this.teamId)
          .get()
      },
      statsByPlayerId () {
        return groupBy(this.stats, 'playerId')
      },
      rows () {
        return this.players.filter(player => {
          switch (this.filter) {
            case 0: // All
              return true
            case 1: // Youth
              return player.youth
            case 2: // Active
              return player.status && player.status !== 'Pending'
            case 3: // Injured
            case 4: // Loaned
            case 5: // Pending
              return player.status === this.currentFilter.text
          }
        }).map(player => {
          const playerWithStats = {
            ...player,
            flag: player.flag
          }

          const stats = this.statsByPlayerId[player.id]
          if (stats) {
            const ovrDiff = {}
            const valueDiff = {}
            stats.forEach(stat => {
              ovrDiff[stat.season] = stat.ovr[1] - stat.ovr[0]
              valueDiff[stat.season] = (stat.value[1] - stat.value[0]) / stat.value[0] * 100
            })
            playerWithStats.ovrDiff = ovrDiff
            playerWithStats.startOVR = stats[0].ovr[0]
            playerWithStats.valueDiff = valueDiff
            playerWithStats.startValue = stats[0].value[0]
          }

          return playerWithStats
        })
      },
      sortNullLast () {
        return (a, b) => {
          if (a === b) {
            return 0
          } else if (a === undefined) {
            return this.sortDesc ? -1 : 1
          } else if (b === undefined) {
            return this.sortDesc ? 1 : -1
          } else {
            return a < b ? -1 : 1
          }
        }
      }
    },
    methods: {
      ovrColor (ovrDiff) {
        switch (true) {
          case ovrDiff > 6:
            return 'green--text text--darken-2'
          case ovrDiff > 4:
            return 'green--text'
          case ovrDiff > 2:
            return 'light-green--text text--darken-2'
          case ovrDiff > 0:
            return 'light-green--text'
          case ovrDiff < -2:
            return 'red--text'
          case ovrDiff < 0:
            return 'orange--text'
          default:
            return 'grey--text'
        }
      },
      valueColor (valueDiff) {
        switch (true) {
          case valueDiff > 100:
            return 'green--text text--darken-2'
          case valueDiff > 50:
            return 'green--text'
          case valueDiff > 25:
            return 'light-green--text text--darken-2'
          case valueDiff > 0:
            return 'light-green--text'
          case valueDiff < -25:
            return 'red--text'
          case valueDiff < 0:
            return 'orange--text'
          default:
            return 'grey--text'
        }
      }
    }
  }
</script>
