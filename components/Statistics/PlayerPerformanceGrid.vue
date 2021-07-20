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
              :color="currentPlayerFilter.color"
              v-text="`mdi-${currentPlayerFilter.icon}`"
            />
            <div
              :class="`text-capitalize ${currentPlayerFilter.color}--text`"
              v-text="`${currentPlayerFilter.text} Players`"
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(opt, i) in playerFilters"
            :key="i"
            @click="playerFilter = i"
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
          single-expand
          :expanded.sync="expanded"
          no-data-text="No Players Found"
          :mobile-breakpoint="0"
        >
          <template #top>
            <v-select
              v-if="!filterType"
              v-model="filterType"
              label="Filter"
              prepend-inner-icon="mdi-filter"
              :items="filterTypeOptions"
              @change="openFilterValueField"
            />
            <v-select
              v-else-if="filterValueOptions.length > 0"
              v-model="filterValue"
              :label="`Filter by ${filterType}`"
              :items="filterValueOptions"
              prepend-inner-icon="mdi-filter"
              append-icon="mdi-backspace"
              :menu-props="{ value: filterValueMenuOpen }"
              @click:append="filterType = null"
              @change="applyFilter"
            />
            <v-text-field
              v-else
              ref="filterValueField"
              v-model="filterValue"
              :label="`Filter by ${filterType}`"
              prepend-inner-icon="mdi-filter"
              append-icon="mdi-backspace"
              append-outer-icon="mdi-magnify"
              autofocus
              @click:append="filterType = null"
              @keydown.enter="applyFilter"
              @click:append-outer="applyFilter"
            />
            <div class="mb-2">
              <v-chip
                v-for="filter in Object.keys(filterValues)"
                :key="filter"
                small
                close
                class="mr-1 mb-1"
                @click:close="filters[filter] = null"
              >
                {{ filter }}:&nbsp;<i>{{ filterValues[filter] }}</i>
              </v-chip>
            </div>
          </template>
          <template #item="{ item, expand, isExpanded }">
            <tr @click="expand(!isExpanded)">
              <td :class="{ 'stick-left': !expanded.length }">
                <v-btn
                  small
                  text
                  color="info"
                  class="text-capitalize"
                  @click.stop="$router.push(`/teams/${teamId}/players/${item.id}`)"
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
              <td class="text-right">{{ item.numMatches }}</td>
              <td class="text-right">{{ item.numMinutes }}</td>
              <td class="text-right">{{ item.numGoals }}</td>
              <td class="text-right">{{ item.numAssists }}</td>
              <td class="text-right">{{ item.numCleanSheets }}</td>
              <td>
                <v-btn
                  icon
                  @click.stop="expand(!isExpanded)"
                >
                  <v-icon>mdi-chevron-{{ isExpanded ? 'up' : 'down' }}</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template #expanded-item="{ item }">
            <tr>
              <td>
                <div
                  v-for="(stat, i) in item.playerStats"
                  :key="i"
                  class="text-center"
                  v-text="seasonLabel(stat.season)"
                />
              </td>
              <td colspan="2">
                <div
                  v-for="(stat, i) in item.playerStats"
                  :key="i"
                  class="text-no-wrap"
                  v-text="stat.competition"
                />
              </td>
              <template v-for="metric in metrics">
                <td
                  :key="metric"
                  class="text-right"
                >
                  <div
                    v-for="(stat, i) in item.playerStats"
                    :key="i"
                    v-text="stat[metric]"
                  />
                </td>
              </template>
              <td />
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
    name: 'PlayerPerformanceGrid',
    mixins: [
      TeamAccessible
    ],
    props: {
      stats: { type: Array, required: true }
    },
    data: () => ({
      key: 0,
      playerFilter: 2,
      playerFilters: [
        { text: 'All', color: 'blue', icon: 'earth' },
        { text: 'Youth', color: 'cyan', icon: 'school' },
        { text: 'Active', color: 'light-green', icon: 'account-check' }
      ],
      metrics: [
        'numMatches',
        'numMinutes',
        'numGoals',
        'numAssists',
        'numCleanSheets'
      ],
      sortDesc: false,
      expanded: [],
      filterType: null,
      filterValue: null,
      filterValueMenuOpen: false,
      filters: {
        Season: null,
        Competition: null
      }
    }),
    computed: {
      currentPlayerFilter () {
        return this.playerFilters[this.playerFilter]
      },
      headers () {
        const headers = [
          { text: 'Name', value: 'name', width: 200, class: this.expanded.length ? '' : 'stick-left' },
          { text: 'Nationality', value: 'nationality', align: 'center', width: 120 },
          { text: 'Pos', value: 'pos', align: 'center', width: 100, sort: sortPos },
          { text: 'Games Played', value: 'numMatches', align: 'end', class: 'text-right' },
          { text: 'Minutes', value: 'numMinutes', align: 'end', class: 'text-right' },
          { text: 'Goals', value: 'numGoals', align: 'end', class: 'text-right' },
          { text: 'Assists', value: 'numAssists', align: 'end', class: 'text-right' },
          { text: 'Clean Sheets', value: 'numCleanSheets', align: 'end', class: 'text-right' },
          { text: '', value: 'expand', width: 40, sortable: false }
        ]

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
          switch (this.playerFilter) {
            case 0: // All
              return true
            case 1: // Youth
              return player.youth
            case 2: // Active
              return player.status && player.status !== 'Pending'
            case 3: // Injured
            case 4: // Loaned
            case 5: // Pending
              return player.status === this.currentPlayerFilter.text
          }
        }).map(player => {
          const playerStats = []
          const matchStats = this.statsByPlayerId[player.id].reduce(
            (totalStats, data) => {
              if (
                [null, data.season].includes(this.filters.Season) &&
                [null, data.competition].includes(this.filters.Competition)
              ) {
                playerStats.push(data)
                this.metrics.forEach(metric => {
                  totalStats[metric] += data[metric]
                })
              }
              return totalStats
            },
            {
              numMatches: 0,
              numMinutes: 0,
              numGoals: 0,
              numAssists: 0,
              numCleanSheets: 0
            }
          )

          return {
            ...player,
            ...matchStats,
            flag: player.flag,
            playerStats
          }
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
      },
      seasons () {
        return [...Array(this.season + 1).keys()].reverse().map(i => ({
          value: i,
          text: this.seasonLabel(i)
        }))
      },
      competitions () {
        return this.$store.$db().model('Competition')
          .query()
          .where('teamId', this.team.id)
          .where(comp => [null, comp.season].includes(this.filters.Season))
          .get()
          .map(comp => comp.name)
      },
      filterTypeOptions () {
        return Object.keys(this.filters)
          .filter(filterType => this.filters[filterType] === null)
      },
      filterValueOptions () {
        switch (this.filterType) {
          case 'Season':
            return this.seasons
          case 'Competition':
            return this.competitions
          default:
            return []
        }
      },
      filterValues () {
        const values = {}
        for (const filter in this.filters) {
          const filterValue = this.filters[filter]
          if (filterValue !== null) {
            if (filter === 'Season') {
              values[filter] = this.seasonLabel(filterValue)
            } else {
              values[filter] = filterValue
            }
          }
        }
        return values
      }
    },
    methods: {
      openFilterValueField () {
        if (this.filterValueOptions.length > 0) {
          this.filterValueMenuOpen = true
        }
      },
      applyFilter () {
        this.filters[this.filterType] = this.filterValue
        this.filterValue = null
        this.filterType = null
      },
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
