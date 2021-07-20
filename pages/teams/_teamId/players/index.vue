<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="`/teams/${teamId}/statistics/development`"
          nuxt
          color="teal"
          dark
        >
          <v-icon left>mdi-trending-up</v-icon>
          Development
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
        <player-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import { playerFragment, contractFragment } from '@/fragments'

  export default {
    name: 'PlayersPage',
    mixins: [
      TeamAccessible
    ],
    async fetch () {
      const query = gql`
        query fetchPlayersPage($teamId: ID!) {
          team(id: $teamId) {
            players {
              ...PlayerData
              contracts { ...ContractData }
            }
          }
        }
        ${playerFragment}
        ${contractFragment}
      `

      const { team: { players } } =
        await this.$graphql.default.request(query, { teamId: this.team.id })

      await this.$store.$db().model('Player').insertOrUpdate({ data: players })

      this.setPage({
        title: `${this.team.name} - Players`,
        headline: 'Players'
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
