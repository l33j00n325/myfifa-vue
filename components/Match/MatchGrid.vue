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
        <template #item.score="{ item }">
          <v-btn
            :to="item.link"
            nuxt
            text
            :color="item.resultColor"
          >
            {{ item.score }}
          </v-btn>
        </template>
        <template #item.playedOn="{ item }">
          {{ item.playedOn | formatDate }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { addYears, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchGrid',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      headers: [
        { text: 'Competition', value: 'competition', align: 'end' },
        { text: 'Home', value: 'home', align: 'end' },
        { text: 'Score', value: 'score', align: 'center', sortable: false },
        { text: 'Away', value: 'away' },
        { text: 'Date Played', value: 'playedOn' },
        { text: 'Stage', value: 'stage' }
      ],
      seasonFilter: null,
      competition: null,
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
      ...mapGetters('competitions', {
        getCompetition: 'get'
      }),
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
        const competitions = (this.team.competitionsIds || []).map(
          competitionId => this.getCompetition(competitionId)
        )
        return competitions
          .filter(competition => [null, competition.season].includes(this.filters.Season))
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
      clearAllFilters () {
        this.seasonFilter = null
        this.competition = null
      },
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
            return this.matchInSeason(match)
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
      },
      matchInSeason (match) {
        const teamStart = parseISO(this.team.startedOn)
        const datePlayed = parseISO(match.playedOn)
        const seasonStart = addYears(teamStart, this.filters.Season)
        const seasonEnd = addYears(teamStart, this.filters.Season + 1)
        return seasonStart <= datePlayed && datePlayed < seasonEnd
      }
    }
  }
</script>
