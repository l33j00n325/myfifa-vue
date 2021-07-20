<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-account"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <nationality-field v-model="attributes.nationality" />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="attributes.pos"
          label="Position"
          prepend-icon="mdi-run"
          :items="positions"
          :rules="rulesFor.pos"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="attributes.secPos"
          label="Secondary Position(s)"
          prepend-icon="mdi-walk"
          :items="positions"
          multiple
          chips
          deletable-chips
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.age"
          label="Age"
          prepend-icon="mdi-calendar"
          :rules="rulesFor.age"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.ovr"
          label="OVR"
          prepend-icon="mdi-trending-up"
          :rules="rulesFor.ovr"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.value"
          label="Value"
          :prefix="team.currency"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.kitNo"
          label="Kit Number"
          prepend-icon="mdi-tshirt-crew"
          :rules="rulesFor.kitNo"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.youth"
          label="Youth Player"
          :disabled="record !== null"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable, TeamAccessible } from '@/mixins'
  import { positions } from '@/constants'
  import { isRequired, inRange, isNumber } from '@/functions'

  export default {
    name: 'PlayerForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      valid: false,
      attributes: {
        name: '',
        pos: '',
        nationality: null,
        secPos: [],
        ovr: null,
        value: '',
        kitNo: null,
        age: null,
        youth: false
      },
      rulesFor: {
        name: [isRequired('Name')],
        pos: [isRequired('Position')],
        age: [
          isRequired('Age'),
          isNumber('Age')
        ],
        ovr: [
          isRequired('OVR'),
          isNumber('OVR'),
          inRange('OVR', [40, 100])
        ],
        kitNo: [
          isNumber('Kit Number'),
          inRange('Kit Number', [1, 99])
        ]
      },
      positions
    }),
    computed: {
      title () {
        return this.record ? `Edit ${this.attributes.name}` : 'New Player'
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.attributes = pick(this.record, [
              'name',
              'pos',
              'age',
              'nationality',
              'ovr',
              'value',
              'kitNo',
              'youth'
            ])
            this.attributes.secPos = [...this.record.secPos]
          } else {
            this.attributes.secPos = []
            this.attributes.youth = false
          }
        }
      }
    },
    methods: {
      ...mapActions('players', {
        createPlayer: 'create',
        updatePlayer: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updatePlayer({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          const { id: playerId } = await this.createPlayer({
            teamId: this.team.id,
            attributes: this.attributes
          })
          this.$router.push({
            name: 'teams-teamId-players-playerId',
            params: {
              teamId: this.team.id,
              playerId
            }
          })
        }
      }
    }
  }
</script>
