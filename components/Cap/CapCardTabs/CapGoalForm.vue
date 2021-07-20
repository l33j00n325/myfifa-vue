<template>
  <base-form
    :submit="saveGoal"
    @reset="resetAttributes"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Add Goal
        </div>
        <minute-field v-model.number="minute" />
        <cap-select
          v-model="attributes.assistId"
          :caps="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          clearable
          hide-details
        />
        <v-checkbox
          v-model="attributes.penalty"
          label="Penalty"
          :disabled="attributes.ownGoal"
          hide-details
          @change="clearAssistedBy"
        />
        <v-checkbox
          v-model="attributes.ownGoal"
          label="Own Goal"
          :disabled="attributes.penalty"
          hide-details
          @change="clearAssistedBy"
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
  import { TeamAccessible, MatchAccessible } from '@/mixins'

  export default {
    name: 'CapGoalForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    props: {
      cap: { type: Object, required: true }
    },
    data: () => ({
      attributes: {
        home: true,
        playerId: null,
        playerName: '',
        assistedBy: '',
        assistId: '',
        ownGoal: false,
        penalty: false
      }
    }),
    computed: {
      assistOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.playerId !== this.attributes.playerId
        )
      }
    },
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.attributes.playerId = cap.playerId
          this.attributes.playerName = cap.name
        }
      },
      'match.home': {
        immediate: true,
        handler (home) {
          this.attributes.home = home === this.team.name
        }
      }
    },
    methods: {
      ...mapActions('goals', {
        createGoal: 'create'
      }),
      clearAssistedBy (bool) {
        if (bool) {
          this.attributes.assistId = null
          this.attributes.assistedBy = null
        }
      },
      async saveGoal () {
        await this.createGoal({
          matchId: this.match.id,
          attributes: {
            ...this.attributes,
            minute: this.minute
          }
        })
        this.$emit('submitted')
      },
      resetAttributes () {
        this.attributes.ownGoal = false
        this.attributes.penalty = false
      }
    }
  }
</script>
