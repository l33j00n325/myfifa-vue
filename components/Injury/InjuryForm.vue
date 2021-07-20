<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    color="pink"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-ambulance"
          color="pink"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-row
        v-if="record && record.endedOn"
        dense
      >
        <v-col cols="12">
          <v-date-field
            v-model="attributes.startedOn"
            label="Injury Date"
            prepend-icon="mdi-calendar-today"
            color="pink"
            :max="contract && contract.endedOn"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-date-field
            v-model="attributes.endedOn"
            label="Recovery Date"
            prepend-icon="mdi-calendar"
            color="pink"
            :min="contract && contract.startedOn"
            required
          />
        </v-col>
      </v-row>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.description"
          label="Description"
          prepend-icon="mdi-ambulance"
          :rules="rulesFor.description"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col
        v-if="record && !record.endedOn"
        cols="12"
      >
        <v-checkbox
          v-model="attributes.recovered"
          label="Player Recovered"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'InjuryForm',
    mixins: [
      DialogFormable
    ],
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false }
    },
    data: () => ({
      attributes: {
        description: '',
        recovered: false
      },
      rulesFor: {
        description: [isRequired('Description')]
      }
    }),
    computed: {
      title () {
        return this.record ? 'Update Injury' : 'Record New Injury'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes = pick(this.record, [
            'startedOn',
            'endedOn',
            'description'
          ])
        }
      }
    },
    methods: {
      ...mapActions('injuries', {
        createInjury: 'create',
        updateInjury: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateInjury({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createInjury({
            playerId: this.player.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
