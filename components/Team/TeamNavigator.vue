<template>
  <v-bottom-navigation
    app
    grow
  >
    <v-btn
      v-for="(link, i) in links"
      :key="i"
      :to="link.to"
      nuxt
      :exact="link.exact"
    >
      <span>{{ link.text }}</span>
      <v-icon>{{ link.icon }}</v-icon>
    </v-btn>
    <team-forms-menu />
  </v-bottom-navigation>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'TeamNavigator',
    computed: {
      ...mapGetters('teams', {
        getTeam: 'get'
      }),
      teamId () {
        return this.$route.params.teamId
      },
      team () {
        return this.getTeam(this.teamId)
      },
      links () {
        return [
          {
            text: 'Dashboard',
            icon: 'mdi-view-dashboard',
            to: `/teams/${this.teamId}`,
            exact: true
          },
          {
            text: 'Players',
            icon: 'mdi-run',
            to: `/teams/${this.teamId}/players`
          },
          {
            text: 'Matches',
            icon: 'mdi-soccer-field',
            to: `/teams/${this.teamId}/matches`
          },
          {
            text: 'Squads',
            icon: 'mdi-clipboard-text',
            to: `/teams/${this.teamId}/squads`
          }
        ]
      }
    }
  }
</script>
