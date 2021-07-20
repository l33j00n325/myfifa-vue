<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    :mobile-breakpoint="0"
    disable-sort
    hide-default-footer
    class="mt-2"
  >
    <template #item="{ item }">
      <tr>
        <td class="stick-left">
          <v-btn
            :to="item.link"
            nuxt
            small
            text
            color="primary"
            class="text-capitalize"
            v-text="item.name"
          />
        </td>
        <td class="text-center">
          <v-icon
            :color="item.statusColor"
            small
            v-text="item.statusIcon"
          />
        </td>
        <td class="text-center">{{ item.matchesPlayed }}</td>
        <td class="text-center">{{ item.wins }}</td>
        <td class="text-center">{{ item.draws }}</td>
        <td class="text-center">{{ item.losses }}</td>
        <td class="text-center">{{ item.goalsFor }}</td>
        <td class="text-center">{{ item.goalsAgainst }}</td>
        <td class="text-center">{{ item.goalDifference }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: 'SeasonCompetitionGrid',
    props: {
      season: { type: Number, required: true },
      competitionStats: { type: Array, required: true }
    },
    data: () => ({
      headers: [
        { text: 'Competition', value: 'name', class: 'stick-left', cellClass: 'stick-left' },
        { text: 'Status', value: 'status', align: 'center' },
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
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      },
      competitions () {
        return this.$store.$db().model('Competition')
          .query()
          .with('team')
          .where('teamId', this.team.id)
          .where('season', this.season)
          .get()
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
              link: competition.link,
              statusIcon: competition.statusIcon,
              statusColor: competition.statusColor,
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
    }
  }
</script>
