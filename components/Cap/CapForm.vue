<template>
  <dialog-form
    v-model="dialog"
    title="Add Cap"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Add Player"
          icon="mdi-plus-circle-outline"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-select
          v-model="cap.pos"
          label="Position"
          prepend-icon="mdi-run"
          :items="positions"
          :rules="rulesFor.pos"
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="cap.player_id"
          :players="activePlayers"
          item-value="id"
          :disabled="cap.start > 0"
          label="Player"
          required
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { matchPositions } from '@/constants'
  import { ActivePlayerSelectable, DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'CapForm',
    mixins: [
      ActivePlayerSelectable,
      DialogFormable
    ],
    props: {
      match: { type: Object, required: true }
    },
    data: () => ({
      cap: {
        player_id: null,
        pos: ''
      },
      rulesFor: {
        pos: [isRequired('Position')]
      }
    }),
    computed: {
      positions () {
        return Object.keys(matchPositions)
      }
    },
    methods: {
      ...mapActions('caps', {
        createCap: 'create'
      }),
      async submit () {
        await this.createCap({
          matchId: this.match.id,
          cap: this.cap
        })
      }
    }
  }
</script>
