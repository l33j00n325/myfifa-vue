<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    :mobile-breakpoint="0"
    disable-sort
    hide-default-footer
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
    <template #item.status="{ item }">
      <v-icon
        :color="item.statusColor"
        small
        v-text="item.statusIcon"
      />
    </template>
  </v-data-table>
</template>

<script>
  import { mapGetters } from 'vuex'
  import filter from 'lodash.filter'

  export default {
    name: 'SeasonCompetitionGrid',
    props: {
      season: { type: Number, required: true },
      competitionStats: { type: Array, required: true }
    },
    data: () => ({
      headers: [
        { text: 'Competition', value: 'name' },
        { text: '', value: 'status' },
        { text: 'GP', value: 'matchesPlayed', align: 'center' },
        { text: 'W', value: 'wins', align: 'center' },
        { text: 'D', value: 'draws', align: 'center' },
        { text: 'L', value: 'losses', align: 'center' },
        { text: 'GF', value: 'goalsFor', align: 'center' },
        { text: 'GA', value: 'goalsAgainst', align: 'center' },
        { text: 'GD', value: 'goalDifference', align: 'center' }
      ]
    }),
    computed: {
      ...mapGetters({
        getTeam: 'teams/get',
        getCompetition: 'competitions/get'
      }),
      team () {
        return this.getTeam(this.$route.params.teamId)
      },
      competitions () {
        const competitions = (this.team.competitionsIds || []).map(
          competitionId => this.getCompetition(competitionId)
        )
        return filter(competitions, { season: this.season })
      },
      results () {
        return this.competitionStats.reduce((results, stats) => {
          results[stats.competition] = stats
          return results
        }, {})
      },
      rows () {
        if (this.loading) {
          return []
        } else {
          return this.competitions.map(competition => {
            const {
              wins = 0,
              draws = 0,
              losses = 0,
              goalsFor = 0,
              goalsAgainst = 0
            } = this.results[competition.name] || {}

            return {
              name: competition.name,
              link: `/teams/${this.team.id}/competitions/${competition.id}`,
              statusIcon: this.statusIcon(competition),
              statusColor: this.statusColor(competition),
              matchesPlayed: wins + draws + losses,
              wins,
              draws,
              losses,
              goalsFor,
              goalsAgainst,
              goalDifference: goalsFor - goalsAgainst
            }
          })
        }
      }
    },
    methods: {
      statusIcon (competition) {
        if (competition.champion === this.team.name) {
          return 'mdi-trophy'
        } else if (competition.champion) {
          return 'mdi-check'
        } else {
          return 'mdi-timelapse'
        }
      },
      statusColor (competition) {
        if (competition.champion === this.team.name) {
          return 'yellow darken-2'
        } else if (competition.champion) {
          return 'green'
        } else {
          return 'gray'
        }
      }
    }
  }
</script>
