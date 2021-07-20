<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-btn v-on="on">
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Competition
        </v-btn>
      </slot>
    </template>
    <template #form>
      <v-col
        v-if="close"
        cols="12"
      >
        <v-autocomplete
          v-model="attributes.champion"
          label="Champion"
          prepend-icon="mdi-crown"
          :items="record.teamOptions"
          :rules="rulesFor.champion"
        />
      </v-col>
      <v-row
        v-else
        dense
      >
        <v-col cols="12">
          <v-text-field
            :value="seasonLabel(season)"
            label="Season"
            prepend-icon="mdi-calendar-text"
            disabled
          />
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-model="attributes.name"
            label="Name"
            prepend-icon="mdi-trophy"
            :items="competitions"
            :rules="rulesFor.name"
            :loading="loadingCompetitions"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-col>
        <template v-if="!record">
          <v-col cols="12">
            <v-select
              v-model="attributes.presetFormat"
              label="Preset Format"
              prepend-icon="mdi-cogs"
              :items="presetFormats"
              clearable
            />
          </v-col>
          <v-scroll-y-transition mode="out-in">
            <v-col
              v-if="attributes.presetFormat"
              cols="12"
            >
              <v-text-field
                v-model.number="attributes.numTeams"
                label="Number of Teams"
                prepend-icon="mdi-account-group"
                :rules="rulesFor.numTeams"
                inputmode="numeric"
              />
            </v-col>
          </v-scroll-y-transition>
          <v-scroll-y-transition mode="out-in">
            <v-row
              v-if="attributes.presetFormat === 'Group + Knockout'"
              dense
            >
              <v-col cols="12">
                <v-text-field
                  v-model.number="attributes.numTeamsPerGroup"
                  label="Teams per Group"
                  prepend-icon="mdi-table"
                  :rules="rulesFor.numTeamsPerGroup"
                  inputmode="numeric"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="attributes.numAdvancesFromGroup"
                  label="Teams Advance per Group"
                  prepend-icon="mdi-tournament"
                  :rules="rulesFor.numAdvancesFromGroup"
                  inputmode="numeric"
                />
              </v-col>
            </v-row>
          </v-scroll-y-transition>
        </template>
      </v-row>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { isRequired, isNumber } from '@/functions'

  const presetFormats = [
    'League',
    'Knockout',
    'Group + Knockout'
  ]

  export default {
    name: 'CompetitionForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null },
      close: { type: Boolean, default: false }
    },
    data: () => ({
      valid: false,
      loadingCompetitions: false,
      attributes: {
        season: null,
        name: '',
        presetFormat: null,
        numTeams: null,
        numTeamsPerGroup: null,
        numAdvancesFromGroup: null
      },
      rulesFor: {
        name: [isRequired('Name')],
        numTeams: [
          isRequired('Number of Teams'),
          isNumber('Number of Teams')
        ],
        numTeamsPerGroup: [
          isRequired('Teams per Group'),
          isNumber('Teams per Group')
        ],
        numAdvancesFromGroup: [
          isRequired('Teams Advance per Group'),
          isNumber('Teams Advance per Group')
        ],
        champion: [isRequired('Champion')]
      },
      presetFormats
    }),
    computed: {
      title () {
        if (this.close) {
          return 'Close Competition'
        } else if (this.record) {
          return 'Edit Competition'
        } else {
          return 'New Competition'
        }
      },
      competitions () {
        return [
          ...new Set(
            this.$store.$db().model('Competition')
              .query()
              .where('teamId', this.team.id)
              .get()
              .map(c => c.name)
          )
        ]
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes = pick(this.record, [
            'name',
            'champion',
            'season'
          ])
        } else {
          this.attributes.season = this.season
        }

        if (this.attributes.length === 0) {
          this.loadCompetitions()
        }
      }
    },
    methods: {
      ...mapActions('competitions', {
        fetchCompetitions: 'fetch',
        createCompetition: 'create',
        updateCompetition: 'update'
      }),
      async loadCompetitions () {
        try {
          this.loadingCompetitions = true
          await this.fetchCompetitions({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loadingCompetitions = false
        }
      },
      async submit () {
        if (this.record) {
          await this.updateCompetition({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          const { id: competitionId } = await this.createCompetition({
            teamId: this.team.id,
            attributes: this.attributes
          })
          this.$router.push({
            name: 'teams-teamId-competitions-competitionId',
            params: {
              teamId: this.team.id,
              competitionId
            }
          })
        }
      }
    }
  }
</script>
