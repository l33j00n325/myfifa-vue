<template>
  <dialog-form
    v-model="dialog"
    title="Edit Squad"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-clipboard-text"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <template v-for="(squadPlayer, i) in sortedSquadPlayers">
        <v-col
          :key="`pos${i}`"
          cols="4"
        >
          <v-select
            v-model="squadPlayer.pos"
            label="Position"
            prepend-icon="mdi-run"
            :items="positions"
            :rules="rulesFor.pos"
            menu-props="auto"
            hide-details
          />
        </v-col>
        <v-col
          :key="`player${i}`"
          cols="8"
        >
          <player-select
            v-model="squadPlayer.playerId"
            :players="activePlayers"
            item-value="id"
            label="Player"
            required
            hide-details
          />
        </v-col>
      </template>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { ActivePlayerSelectable, DialogFormable, TeamAccessible } from '@/mixins'
  import { matchPositions } from '@/constants'
  import { isRequired } from '@/functions'

  export default {
    name: 'SquadForm',
    mixins: [
      ActivePlayerSelectable,
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      valid: false,
      key: 0,
      attributes: {
        name: '',
        squadPlayersAttributes: new Array(11).fill().map((_, id) => ({
          id,
          playerId: null,
          pos: null
        }))
      },
      rulesFor: {
        name: [isRequired('Name')],
        pos: [isRequired('Position')]
      }
    }),
    computed: {
      title () {
        return this.record ? 'Edit Squad' : 'New Squad'
      },
      positions () {
        return Object.keys(matchPositions)
      },
      sortedSquadPlayers () {
        return [...this.attributes.squadPlayersAttributes].sort((a, b) => {
          return a.pos && this.positions.indexOf(a.pos) < this.positions.indexOf(b.pos)
            ? -1
            : 1
        })
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes.name = this.record.name
          this.attributes.squadPlayersAttributes = this.record.squadPlayers
            .map(squadPlayer => ({
              id: squadPlayer.id,
              playerId: squadPlayer.playerId,
              pos: squadPlayer.pos
            }))
        }
      }
    },
    methods: {
      ...mapActions('squads', {
        createSquad: 'create',
        updateSquad: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateSquad({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          this.attributes.squadPlayersAttributes.forEach(attributes => {
            delete attributes.id
          })
          await this.createSquad({
            teamId: this.team.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
