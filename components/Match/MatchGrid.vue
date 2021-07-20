<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="matches"
        sort-by="playedOn"
        sort-desc
        item-key="id"
        no-data-text="No Matches Recorded"
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
        <template #item="{ item }">
          <tr>
            <td class="text-center">
              <div>{{ item.home }} v {{ item.away }}</div>
              <div :class="`${item.resultColor}--text`">{{ item.score }}</div>
            </td>
            <td class="text-center">
              <div>{{ item.competition }}</div>
              <i v-if="item.stage">{{ item.stage }}</i>
            </td>
            <td>{{ item.playedOn | formatDate }}</td>
            <td class="stick-right">
              <v-btn
                :to="item.link"
                nuxt
                block
                color="info"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchGrid',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      headers: [
        { text: 'Match', value: 'score', align: 'center', sortable: false, width: 250 },
        { text: 'Competition', value: 'competition', align: 'center', sortable: false, width: 250 },
        { text: 'Date Played', value: 'playedOn', width: 120 },
        { text: 'Link', value: 'link', align: 'center', class: 'stick-right', sortable: false, width: 40 }
      ],
      filterType: null,
      filterValue: null,
      filterValueMenuOpen: false,
      filters: {
        Season: null,
        Competition: null,
        Stage: null,
        Team: null,
        Result: null
      }
    }),
    computed: {
      matches () {
        return this.$store.$db().model('Match')
          .query()
          .where('teamId', this.team.id)
          .where(match => {
            for (const filter in this.filters) {
              if (!this.matchPassesFilter(match, filter)) {
                return false
              }
            }

            return true
          })
          .get()
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
          case 'Result':
            return ['Win', 'Draw', 'Loss']
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
      matchPassesFilter (match, filter) {
        const filterValue = this.filters[filter]

        if (filterValue === null) {
          return true
        }

        switch (filter) {
          case 'Season':
            return filterValue === match.season
          case 'Competition':
            return filterValue === match.competition
          case 'Stage':
            return match.stage &&
              match.stage.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
          case 'Team':
            return match.home.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 ||
              match.away.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
          case 'Result':
            return filterValue.toLowerCase() === match.teamResult
        }
      }
    }
  }
</script>
