<template>
  <base-form
    :submit="saveSubstitution"
    @reset="attributes.injury = false"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Substitute Player
        </div>
        <minute-field v-model.number="minute" />
        <player-select
          v-model="attributes.replacementId"
          :players="availablePlayers"
          item-value="id"
          label="Replaced By"
          icon="mdi-subdirectory-arrow-right"
          required
        />
        <v-checkbox
          v-model="attributes.injury"
          label="Injury"
          hide-details
        />
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            primary
            text
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { ActivePlayerSelectable, MatchAccessible } from '@/mixins'

  export default {
    name: 'CapSubstitutionForm',
    mixins: [
      ActivePlayerSelectable,
      MatchAccessible
    ],
    props: {
      cap: { type: Object, required: true }
    },
    data: () => ({
      attributes: {
        playerId: null,
        replacementId: '',
        injury: false
      }
    }),
    computed: {
      availablePlayers () {
        const selectedIds = this.sortedCaps.map(cap => cap.playerId)
        return this.activePlayers.filter(player => {
          if (selectedIds.indexOf(player.id) < 0) {
            return true
          } else if (this.record) {
            return player.id === this.record.replacementId
          }
        })
      }
    },
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.attributes.playerId = cap.playerId
        }
      }
    },
    methods: {
      ...mapActions('substitutions', {
        createSubstitution: 'create'
      }),
      async saveSubstitution () {
        await this.createSubstitution({
          matchId: this.match.id,
          attributes: {
            ...this.attributes,
            minute: this.minute
          }
        })
        this.$emit('submitted')
      }
    }
  }
</script>
