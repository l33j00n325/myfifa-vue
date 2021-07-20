<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    color="indigo"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-transit-transfer"
          color="indigo"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.startedOn"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :min="record ? null : team.currentlyOn"
          color="indigo"
          required
        />
      </v-col>
      <v-col
        v-if="record && record.endedOn"
        cols="12"
      >
        <v-date-field
          v-model="attributes.endedOn"
          label="Return Date"
          prepend-icon="mdi-calendar"
          :min="attributes.startedOn"
          color="indigo"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.origin"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
          :rules="rulesFor.origin"
          :disabled="loanOut"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="rulesFor.destination"
          :disabled="!loanOut"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.wagePercentage"
          label="Wage Percentage (%)"
          :rules="rulesFor.wagePercentage"
          inputmode="numeric"
        />
      </v-col>
      <v-col
        v-if="record && !record.endedOn"
        cols="12"
      >
        <v-checkbox
          v-model="attributes.returned"
          label="Player Returned"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { isRequired, isNumber, inRange } from '@/functions'

  export default {
    name: 'LoanForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false }
    },
    data: () => ({
      attributes: {
        startedOn: '',
        origin: '',
        destination: '',
        wagePercentage: null,
        returned: false
      },
      rulesFor: {
        origin: [isRequired('Origin')],
        destination: [isRequired('Destination')],
        wagePercentage: [
          isNumber('Wage Percentage'),
          inRange('Wage Percentage', [0, 100])
        ]
      }
    }),
    computed: {
      loanOut () {
        return this.record
          ? this.team.name === this.record.origin
          : this.player.status && this.player.status.length > 0
      },
      title () {
        return this.record ? 'Update Loan' : 'Record New Loan'
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.attributes = pick(this.record, [
              'startedOn',
              'endedOn',
              'origin',
              'destination',
              'wagePercentage'
            ])
          } else {
            this.attributes.startedOn = this.team.currentlyOn
            if (this.loanOut) {
              this.attributes.origin = this.team.name
            } else {
              this.attributes.destination = this.team.name
            }
          }
        }
      }
    },
    methods: {
      ...mapActions('loans', {
        createLoan: 'create',
        updateLoan: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateLoan({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createLoan({
            playerId: this.player.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
