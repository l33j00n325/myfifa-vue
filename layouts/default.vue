<template>
  <v-app dark>
    <template v-if="currentUser">
      <app-bar />
      <template v-if="team">
        <team-navigator />
        <client-only>
          <team-channel />
        </client-only>
      </template>
    </template>
    <app-broadcaster />
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'Layout',
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    head () {
      return {
        title: this.title
      }
    },
    computed: {
      ...mapState([
        'token',
        'currentUser'
      ]),
      ...mapState('app', [
        'title'
      ]),
      ...mapGetters('teams', {
        getTeam: 'get'
      }),
      team () {
        return this.getTeam(this.$route.params.teamId)
      }
    },
    watch: {
      'currentUser.dark_mode': {
        immediate: true,
        handler (darkModeOn) {
          this.$vuetify.theme.dark = darkModeOn
        }
      },
      token: {
        immediate: true,
        handler (token) {
          if (token) {
            this.$graphql.default.setHeader('authorization', `Bearer ${token}`)
          } else {
            this.$graphql.default.setHeaders({})
          }
        }
      }
    }
  }
</script>
