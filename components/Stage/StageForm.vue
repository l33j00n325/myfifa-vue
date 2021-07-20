<template>
  <dialog-form
    v-model="dialog"
    title="New Stage"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-btn
          class="my-1"
          dark
          color="teal"
          v-on="on"
          v-text="'Add Stage'"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-table"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.table"
          row
          hide-details
        >
          <v-radio
            label="Table"
            :value="true"
          />
          <v-radio
            label="Elimination Round"
            :value="false"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.numTeams"
          label="Number of Teams"
          prepend-icon="mdi-account-group"
          :rules="rulesFor.numTeams"
          inputmode="numeric"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="!attributes.table"
          cols="12"
        >
          <v-text-field
            v-model.number="attributes.numFixtures"
            label="Number of Fixtures"
            prepend-icon="mdi-sword-cross"
            :rules="rulesFor.numFixtures"
            inputmode="numeric"
          />
        </v-col>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { DialogFormable } from '@/mixins'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'StageForm',
    mixins: [
      DialogFormable
    ],
    props: {
      competition: { type: Object, required: true }
    },
    data: () => ({
      valid: false,
      attributes: {
        name: '',
        numTeams: null,
        numFixtures: null,
        table: false
      },
      rulesFor: {
        name: [isRequired('Name')],
        numTeams: [
          isRequired('Number of Teams'),
          isNumber('Number of Teams')
        ],
        numFixtures: [
          isRequired('Number of Fixtures'),
          isNumber('Number of Fixtures')
        ]
      }
    }),
    watch: {
      dialog (open) {
        if (open) {
          this.attributes.table = false
        }
      },
      'attributes.table' (val) {
        if (val) {
          this.attributes.numFixtures = null
        }
      }
    },
    methods: {
      ...mapActions('stages', {
        createStage: 'create'
      }),
      async submit () {
        await this.createStage({
          competitionId: this.competition.id,
          stage: this.stage
        })
      }
    }
  }
</script>
