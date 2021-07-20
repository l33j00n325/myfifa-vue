<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-table-row-plus-after"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Team"
          prepend-icon="mdi-shield-half-full"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="attributes.wins"
          prepend-icon="mdi-alpha-w"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="attributes.draws"
          prepend-icon="mdi-alpha-d"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="attributes.losses"
          prepend-icon="mdi-alpha-l"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.goalsFor"
          label="GF"
          prepend-icon="mdi-soccer"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.goalsAgainst"
          label="GA"
          prepend-icon="mdi-soccer"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { isNumber } from '@/functions'

  export default {
    name: 'TableRowForm',
    mixins: [
      DialogFormable
    ],
    props: {
      stage: { type: Object, required: true },
      record: { type: Object, default: null }
    },
    data: () => ({
      attributes: {
        name: '',
        wins: null,
        draws: null,
        losses: null,
        goalsFor: null,
        goalsAgainst: null
      },
      rulesForNumber: [isNumber()]
    }),
    computed: {
      title () {
        return `${this.record ? 'Edit' : 'Add'} Table Row`
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes = pick(this.record, [
            'name',
            'wins',
            'draws',
            'losses',
            'goalsFor',
            'goalsAgainst'
          ])
        }
      }
    },
    methods: {
      ...mapActions('tableRows', {
        createTableRow: 'create',
        updateTableRow: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateTableRow({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createTableRow({
            stageId: this.stage.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
