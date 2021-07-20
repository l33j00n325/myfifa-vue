<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-soccer"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Goal"
          icon="mdi-soccer"
          color="blue"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.home"
          row
          hide-details
          @change="clearNames"
        >
          <v-radio
            :label="match.home"
            :value="true"
            color="teal"
          />
          <v-radio
            :label="match.away"
            :value="false"
            color="pink"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <minute-field v-model.number="minute" />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="teamGoal"
          v-model="attributes.playerId"
          :caps="scorerOptions"
          label="Goal Scorer"
          required
        />
        <v-text-field
          v-else
          v-model="attributes.playerName"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :rules="rulesFor.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="teamGoal"
          v-model="attributes.assistId"
          :caps="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          clearable
          hide-details
        />
        <v-text-field
          v-else
          v-model="attributes.assistedBy"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          hide-details
          :disabled="attributes.penalty || attributes.ownGoal"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.penalty"
          label="Penalty"
          :disabled="attributes.ownGoal"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.ownGoal"
          label="Own Goal"
          :disabled="attributes.penalty"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'GoalForm',
    mixins: [
      TeamAccessible,
      DialogFormable,
      MatchAccessible
    ],
    props: {
      record: { type: Object, default: null }
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
      },
      rulesFor: {
        playerName: [isRequired('Goal Scorer')]
      }
    }),
    computed: {
      title () {
        return `${this.record ? 'Edit' : 'Record'} Goal`
      },
      scorerOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.playerId !== this.attributes.assistId
        )
      },
      assistOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.playerId !== this.attributes.playerId
        )
      },
      teamGoal () {
        return !this.attributes.home ^ this.match.home === this.team.name
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.attributes = pick(this.record, [
              'home',
              'playerId',
              'playerName',
              'assistedBy',
              'assistId',
              'ownGoal',
              'penalty'
            ])
            this.minute = this.record.minute
          } else {
            this.attributes.ownGoal = false
            this.attributes.penalty = false
          }
        }
      },
      'attributes.assistId' (val) {
        if (!val && this.teamGoal) {
          this.attributes.assistedBy = ''
        }
      },
      'attributes.penalty' (val) {
        this.clearAssistedBy(val)
      },
      'attributes.ownGoal' (val) {
        this.clearAssistedBy(val)
      }
    },
    methods: {
      ...mapActions('goals', {
        createGoal: 'create',
        updateGoal: 'update'
      }),
      clearNames () {
        this.attributes.playerId = null
        this.attributes.playerName = null
        this.attributes.assistId = null
        this.attributes.assistedBy = null
      },
      clearAssistedBy (val) {
        console.log(`clearAssistedBy `, val)
        if (val) {
          this.attributes.assistId = null
          this.attributes.assistedBy = null
        }
      },
      async submit () {
        const attributes = {
          ...this.attributes,
          minute: this.minute
        }

        if (this.record) {
          await this.updateGoal({
            id: this.record.id,
            attributes
          })
        } else {
          await this.createGoal({
            matchId: this.match.id,
            attributes
          })
        }
      }
    }
  }
</script>
