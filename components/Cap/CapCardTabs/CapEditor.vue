<template>
  <div class="pa-2">
    <div class="text-subtitle-2 pb-2">
      Edit Position and Player
    </div>
    <v-select
      v-model="pos"
      label="Position"
      prepend-icon="mdi-run"
      :items="positions"
      menu-props="auto"
      required
      @change="setPosition"
    />
    <player-select
      v-model="playerId"
      :players="activePlayers"
      item-value="id"
      required
      :disabled="cap.start > 0"
      @input="setPlayer"
    />
  </div>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { ActivePlayerSelectable } from '@/mixins'
  import { matchPositions } from '@/constants'

  export default {
    name: 'CapEditor',
    mixins: [
      ActivePlayerSelectable
    ],
    props: {
      cap: { type: Object, required: true }
    },
    data: () => ({
      pos: null,
      playerId: null
    }),
    computed: {
      positions () {
        return Object.keys(matchPositions)
      }
    },
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.pos = cap.pos
          this.playerId = cap.playerId
        }
      }
    },
    methods: {
      ...mapMutations('broadcaster', [
        'announce'
      ]),
      ...mapActions('caps', {
        updateCap: 'update'
      }),
      async setPosition (position) {
        await this.updateCapAttribute('pos', position)
      },
      async setPlayer (playerId) {
        await this.updateCapAttribute('playerId', playerId)
      },
      async updateCapAttribute (key, value) {
        try {
          await this.updateCap({
            id: this.cap.id,
            attributes: { [key]: value }
          })
          this.$emit('submitted')
        } catch (e) {
          this.pos = this.cap.pos
          this.playerId = this.cap.playerId
          this.announce({
            message: e.message,
            color: 'red'
          })
        }
      }
    }
  }
</script>
