<template>
  <v-app-bar app>
    <span class="text-h5 font-weight-light">
      MyFIFA Manager
    </span>

    <v-spacer />

    <v-btn
      v-for="(action, i) in actions"
      :key="i"
      icon
      class="hidden-xs-only"
      @click="action.click"
    >
      <v-icon>{{ action.icon }}</v-icon>
    </v-btn>

    <v-menu>
      <template #activator="{ on }">
        <v-btn
          icon
          class="hidden-sm-and-up"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(action, i) in actions"
          :key="i"
          @click="action.click"
        >
          <v-list-item-icon>
            <v-icon>{{ action.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ action.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <app-info v-model="infoDialog" />

    <template #extension>
      <team-bar-extension
        v-if="team"
        :team="team"
      />
      <v-toolbar-title
        v-else
        class="text-h6 font-weight-thin"
        v-text="headline"
      />
    </template>
  </v-app-bar>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    name: 'AppBar',
    data: () => ({
      infoDialog: false,
      togglingMode: false
    }),
    computed: {
      ...mapState('app', [
        'headline'
      ]),
      ...mapGetters([
        'currentUser'
      ]),
      teamId () {
        return this.$route.params.teamId
      },
      team () {
        return this.$store.$db().model('Team').find(this.teamId)
      },
      actions () {
        return [
          {
            icon: 'mdi-shield-search',
            text: 'Teams',
            click: this.goToTeams
          },
          {
            icon: 'mdi-account',
            text: 'Account',
            click: this.goToAccount
          },
          {
            icon: `mdi-weather-${this.currentUser.dark_mode ? 'night' : 'sunny'}`,
            text: `${this.currentUser.dark_mode ? 'Dark' : 'Light'} Mode`,
            click: this.toggleMode,
            loading: this.togglingMode
          },
          {
            icon: 'mdi-information-outline',
            text: 'About',
            click: this.openInfoDialog
          },
          {
            icon: 'mdi-exit-to-app',
            text: 'Log Out',
            click: this.logout
          }
        ]
      }
    },
    methods: {
      ...mapActions({
        logout: 'logout',
        setDarkMode: 'user/setDarkMode'
      }),
      goToTeams () {
        this.$router.push({ name: 'teams' })
      },
      goToAccount () {
        this.$router.push({ name: 'account' })
      },
      openInfoDialog () {
        this.infoDialog = true
      },
      async toggleMode () {
        try {
          this.togglingMode = true
          await this.setDarkMode(!this.currentUser.dark_mode)
        } catch (e) {
          console.error(e)
        } finally {
          this.togglingMode = false
        }
      }
    }
  }
</script>
