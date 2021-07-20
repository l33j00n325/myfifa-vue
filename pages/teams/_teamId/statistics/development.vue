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
          :to="`/teams/${teamId}/statistics/performances`"
          nuxt
          color="purple"
          dark
        >
          <v-icon left>mdi-numeric</v-icon>
          Performances
        </v-btn>
      </v-col>
      <v-col cols="12">
        <player-development-grid :stats="playerDevelopmentStats" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import { playerFragment, playerDevelopmentStatsFragment } from '@/fragments'

  export default {
    name: 'DevelopmentStatisticsPage',
    mixins: [
      TeamAccessible
    ],
    async asyncData ({ params, store, $graphql }) {
      const query = gql`
        query fetchPlayersPage($teamId: ID!) {
          team(id: $teamId) {
            players { ...PlayerData }
            playerDevelopmentStats { ...PlayerDevelopmentStatsData }
          }
        }
        ${playerFragment}
        ${playerDevelopmentStatsFragment}
      `

      const { team: { players, playerDevelopmentStats } } =
        await $graphql.default.request(query, { teamId: parseInt(params.teamId) })

      await store.$db().model('Player').insertOrUpdate({ data: players })

      return { playerDevelopmentStats }
    },
    async fetch () {
      this.setPage({
        title: `${this.team.name} - Player Development`,
        headline: 'Player Development'
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
