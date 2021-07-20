<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    color="blue"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-file-document-outline"
          color="blue"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.startedOn"
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.endedOn"
          label="End Date"
          prepend-icon="mdi-calendar"
          :min="attributes.startedOn"
          :max="maxEndDate"
          required
          start-with-year
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.wage"
          label="Wage"
          :prefix="team.currency"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.signingBonus"
          label="Signing Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.releaseClause"
          label="Release Clause"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.performanceBonus"
          label="Performance Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-row
          v-if="attributes.performanceBonus"
          dense
        >
          <v-col cols="6">
            <v-text-field
              v-model.number="attributes.bonusReq"
              label="Bonus Req."
              prefix="if"
              :rules="rulesFor.bonusReq"
              inputmode="numeric"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="attributes.bonusReqType"
              label="Bonus Req. Type"
              :items="bonusRequirementTypes"
              :rules="rulesFor.bonusReqType"
            />
          </v-col>
        </v-row>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'ContractForm',
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
      valid: false,
      attributes: {
        startedOn: null,
        endedOn: null,
        wage: null,
        signingBonus: null,
        releaseClause: null,
        performanceBonus: null,
        bonusReq: null,
        bonusReqType: null
      },
      rulesFor: {
        bonusReq: [isRequired('Bonus Req.')],
        bonusReqType: [isRequired('Bonus Req. Type')]
      },
      bonusRequirementTypes: [
        'Appearances',
        'Goals',
        'Assists',
        'Clean Sheets'
      ]
    }),
    computed: {
      title () {
        return this.record ? 'Edit Contract' : 'Sign New Contract'
      },
      maxEndDate () {
        return this.attributes.startedOn && format(
          addYears(parseISO(this.attributes.startedOn), 6),
          'yyyy-MM-dd'
        )
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.attributes = pick(this.record, [
              'startedOn',
              'endedOn',
              'wage',
              'signingBonus',
              'releaseClause',
              'performanceBonus',
              'bonusReq',
              'bonusReqType'
            ])
          } else {
            this.attributes.startedOn = this.team.currentlyOn
            this.attributes.endedOn = this.team.currentlyOn
          }
        }
      },
      'attributes.startedOn' (val) {
        if (val && this.attributes?.endedOn < val) {
          this.attributes.endedOn = val
        }
      },
      'attributes.performanceBonus' (val) {
        if (!val) {
          this.attributes.bonusReq = null
          this.attributes.bonusReqType = null
        }
      }
    },
    methods: {
      ...mapActions('contracts', {
        createContract: 'create',
        updateContract: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateContract({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createContract({
            playerId: this.player.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
