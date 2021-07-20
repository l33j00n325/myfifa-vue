<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-human"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Penalty Shootout"
          icon="mdi-human"
          color="indigo"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.homeScore"
          label="Home Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.homeScore"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.awayScore"
          label="Away Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.awayScore"
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'PenaltyShootoutForm',
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
        homeScore: null,
        awayScore: null
      },
      rulesFor: {
        homeScore: [
          isRequired('Home Score'),
          isNumber('Home Score')
        ],
        awayScore: [
          isRequired('Away Score'),
          isNumber('Away Score')
        ]
      }
    }),
    computed: {
      title () {
        return `${this.record ? 'Edit' : 'Record'} Penalty Shootout`
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes = pick(this.record, [
            'homeScore',
            'awayScore'
          ])
        }
      }
    },
    methods: {
      ...mapActions('penaltyShootout', {
        savePenaltyShootout: 'save'
      }),
      async submit () {
        await this.savePenaltyShootout({
          matchId: this.match.id,
          attributes: this.attributes
        })
      }
    }
  }
</script>
