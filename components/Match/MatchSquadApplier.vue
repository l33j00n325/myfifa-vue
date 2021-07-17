<template>
  <v-tooltip
    v-if="squads.length > 0"
    color="cyan"
    bottom
  >
    <template #activator="{ on: tooltip }">
      <v-menu
        class="d-inline-block"
        offset-y
        offset-overflow
      >
        <template #activator="{ on: menu }">
          <v-btn
            icon
            v-on="{ ...menu, ...tooltip }"
          >
            <v-icon color="cyan">mdi-download</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="squad in squads"
            :key="squad.id"
            @click="applySquadToMatch(squad.id)"
          >
            {{ squad.name }}
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    Apply Squad
  </v-tooltip>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import filter from 'lodash.filter'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchSquadApplier',
    mixins: [
      TeamAccessible
    ],
    props: {
      match: { type: Object, required: true }
    },
    computed: {
      ...mapState('squads', {
        squadRecords: 'records'
      }),
      squads () {
        return filter(this.squadRecords, { teamId: this.team.id })
      }
    },
    methods: {
      ...mapActions('matches', [
        'applySquad'
      ]),
      async applySquadToMatch (squadId) {
        try {
          await this.applySquad({
            matchId: this.match.id,
            squadId
          })
        } catch (e) {
          alert(e.message)
        }
      }
    }
  }
</script>
