<template>
  <v-container>
    <v-row>
      <v-col>
        <squad-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import { squadFragment, playerFragment } from '@/fragments'

  export default {
    name: 'SquadsPage',
    mixins: [
      TeamAccessible
    ],
    async fetch () {
      const query = gql`
        query fetchSquadsPage($teamId: ID!) {
          team(id: $teamId) {
            squads { ...SquadData }
            players { ...PlayerData }
          }
        }
        ${squadFragment}
        ${playerFragment}
      `

      const { team: { squads, players } } =
        await this.$graphql.default.request(query, {
          matchId: this.matchId,
          teamId: this.team.id
        })

      await Promise.all([
        this.$store.$db().model('Squad').insertOrUpdate({ data: squads }),
        this.$store.$db().model('Player').insertOrUpdate({ data: players })
      ])

      this.setPage({
        title: `${this.team.name} - Squads`,
        headline: 'Squads'
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
