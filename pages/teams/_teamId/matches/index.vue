<template>
  <v-container>
    <v-row>
      <v-col>
        <match-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import { matchFragment, competitionFragment } from '@/fragments'

  export default {
    name: 'MatchesPage',
    mixins: [
      TeamAccessible
    ],
    async fetch () {
      const query = gql`
        query fetchMatchesPage($teamId: ID!) {
          team(id: $teamId) {
            matches { ...MatchData }
            competitions { ...CompetitionData }
          }
        }
        ${matchFragment}
        ${competitionFragment}
      `

      const { team: { matches, competitions } } =
        await this.$graphql.default.request(query, {
          matchId: this.matchId,
          teamId: this.team.id
        })

      await Promise.all([
        this.$store.$db().model('Match').insertOrUpdate({ data: matches }),
        this.$store.$db().model('Competition').insertOrUpdate({ data: competitions })
      ])

      this.setPage({
        title: `${this.team.name} - Matches`,
        headline: 'Matches'
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
