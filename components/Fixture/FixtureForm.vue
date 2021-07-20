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
        <v-combobox
          v-model="attributes.homeTeam"
          label="Home Team"
          prepend-icon="mdi-home"
          :items="competitionTeams"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="attributes.awayTeam"
          label="Away Team"
          prepend-icon="mdi-bus"
          :items="competitionTeams"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col
        class="mt-3 text-center"
        cols="12"
      >
        <v-btn @click="addLeg">Add Fixture Leg</v-btn>
      </v-col>
      <v-container :key="key">
        <v-row
          v-for="(leg, i) in attributes.legsAttributes"
          v-show="!leg._destroy"
          :key="i"
          dense
        >
          <v-col cols="6">
            <v-text-field
              v-model="leg.homeScore"
              label="Home Score"
              prepend-icon="mdi-soccer"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="leg.awayScore"
              label="Away Score"
              prepend-icon="mdi-soccer"
              append-outer-icon="mdi-delete"
              hide-details
              @click:append-outer="leg._destroy = true; key++"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { CompetitionAccessible, DialogFormable } from '@/mixins'

  export default {
    name: 'FixtureForm',
    mixins: [
      CompetitionAccessible,
      DialogFormable
    ],
    props: {
      stage: { type: Object, required: true },
      record: { type: Object, default: null }
    },
    data: () => ({
      key: 0,
      attributes: {
        homeTeam: '',
        awayTeam: '',
        legsAttributes: [{
          homeScore: '',
          awayScore: '',
          _destroy: false
        }]
      }
    }),
    computed: {
      title () {
        return this.record ? 'Edit Fixture' : 'Add Fixture'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes = pick(this.record, [
            'homeTeam',
            'awayTeam'
          ])
          this.attributes.legsAttributes = this.record.legs.map(leg => ({
            ...pick(leg, ['id', 'homeScore', 'awayScore']),
            _destroy: false
          }))
        }
      }
    },
    methods: {
      ...mapActions('fixtures', {
        createFixture: 'create',
        updateFixture: 'update'
      }),
      addLeg () {
        this.attributes.legsAttributes.push({
          homeScore: '',
          awayScore: '',
          _destroy: false
        })
        this.key++
      },
      async submit () {
        if (this.record) {
          await this.updateFixture({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createFixture({
            stageId: this.stage.id,
            attributes: this.attributes
          })
        }
      }

    }
  }
</script>
