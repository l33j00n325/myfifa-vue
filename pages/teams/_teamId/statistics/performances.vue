<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="`/teams/${teamId}/players`"
          nuxt
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>
        <v-btn
          :to="`/teams/${teamId}/statistics/development`"
          nuxt
          color="teal"
          dark
        >
          <v-icon left>mdi-trending-up</v-icon>
          Development
        </v-btn>
      </v-col>
      <v-col cols="12">
        <player-performance-grid :stats="playerPerformanceStats" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import {
    playerFragment,
    playerPerformanceStatsFragment,
    competitionFragment
  } from '@/fragments'

  export default {
    name: 'PerformancesStatisticsPage',
    mixins: [
      TeamAccessible
    ],
    async asyncData ({ params, store, $graphql }) {
      const query = gql`
        query fetchPlayersPage($teamId: ID!) {
          team(id: $teamId) {
            players { ...PlayerData }
            playerPerformanceStats { ...PlayerPerformanceStatsData }
            competitions { ...CompetitionData }
          }
        }
        ${playerFragment}
        ${playerPerformanceStatsFragment}
        ${competitionFragment}
      `

      const { team: { players, playerPerformanceStats, competitions } } =
        await $graphql.default.request(query, { teamId: parseInt(params.teamId) })

      await Promise.all([
        store.$db().model('Player').insertOrUpdate({ data: players }),
        store.$db().model('Competition').insertOrUpdate({ data: competitions })
      ])

      return { playerPerformanceStats }
    },
    async fetch () {
      this.setPage({
        title: `${this.team.name} - Player Performances`,
        headline: 'Player Performances'
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
