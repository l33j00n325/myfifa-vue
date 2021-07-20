<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <team-form>
          <template #default="{ on }">
            <v-btn v-on="on">
              <v-icon left>mdi-plus</v-icon>
              Team
            </v-btn>
          </template>
        </team-form>
      </v-col>
      <v-col cols="12">
        <team-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { teamFragment } from '@/fragments'

  export default {
    name: 'TeamsPage',
    async fetch () {
      this.setPage({
        headline: 'Teams'
      })

      const query = gql`
        query fetchTeams {
          teams { ...TeamData }
        }
        ${teamFragment}
      `

      const { teams } = await this.$graphql.default.request(query)
      await this.$store.$db().model('Team').insert({ data: teams })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
