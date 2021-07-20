<template>
  <v-tooltip
    v-if="starters.length === 11"
    color="teal"
    bottom
  >
    <template #activator="{ on: tooltip }">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        offset-y
        offset-overflow
        class="d-inline-block"
      >
        <template #activator="{ on: menu }">
          <v-btn
            icon
            v-on="{ ...menu, ...tooltip }"
          >
            <v-icon color="teal">mdi-upload</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="squadName"
              label="New Squad"
              :loading="loading"
              :disabled="loading"
              hint="Press Enter to Save"
              @keypress.enter.prevent="saveLineupToSquad(null)"
            />
          </v-list-item>
          <v-list-item
            v-for="squad in squads"
            :key="squad.id"
            @click="saveLineupToSquad(squad.id)"
          >
            {{ squad.name }}
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    Save Lineup to Squad
  </v-tooltip>
</template>

<script>
  import { mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchSquadSaver',
    mixins: [
      TeamAccessible
    ],
    props: {
      match: { type: Object, required: true }
    },
    data: () => ({
      menu: false,
      loading: false,
      squadName: ''
    }),
    computed: {
      squads () {
        return this.$store.$db().model('Squad')
          .query()
          .with('squadPlayers')
          .where('teamId', this.team.id)
          .get()
      },
      starters () {
        return this.match.caps.filter(c => c.start === 0)
      }
    },
    methods: {
      ...mapActions('squads', {
        createSquad: 'create',
        storeLineup: 'storeLineup'
      }),
      async saveLineupToSquad (squadId) {
        try {
          if (squadId) {
            await this.storeLineup({ squadId, matchId: this.match.id })
          } else if (this.squadName) {
            this.loading = true

            await this.createSquad({
              teamId: this.team.id,
              attributes: {
                name: this.squadName,
                squadPlayersAttributes: this.starters.map(cap => ({
                  playerId: cap.playerId,
                  pos: cap.pos
                }))
              }
            })
          }

          this.menu = false
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
