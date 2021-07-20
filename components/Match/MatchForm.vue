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
          Match
        </v-btn>
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.playedOn"
          label="Date Played"
          prepend-icon="mdi-calendar-today"
          required
          :color="color"
          :min="record ? null : team.currentlyOn"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="attributes.competition"
          label="Competition"
          prepend-icon="mdi-trophy"
          :items="competitions"
          :rules="rulesFor.competition"
          :loading="loadingCompetitions"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="attributes.competition"
          cols="12"
        >
          <v-combobox
            v-model="attributes.stage"
            label="Stage"
            prepend-icon="mdi-tournament"
            :items="stages"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-col>
      </v-scroll-y-transition>
      <v-col cols="12">
        <v-combobox
          v-model="attributes.home"
          label="Home Team"
          prepend-icon="mdi-home"
          :items="teamOptions"
          :rules="rulesFor.home"
          :loading="loadingTeams"
          :append-outer-icon="`mdi-shield-${isHome ? 'star' : 'outline'}`"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
          @click:append-outer="setHome"
        />
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="attributes.away"
          label="Away Team"
          prepend-icon="mdi-bus"
          :items="teamOptions"
          :rules="rulesFor.away"
          :loading="loadingTeams"
          :append-outer-icon="`mdi-shield-${isAway ? 'star' : 'outline'}`"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
          @click:append-outer="setAway"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.extraTime"
          label="Extra Time Required"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import pick from 'lodash.pick'
  import { parseISO } from 'date-fns'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { competitionFragment, baseStageFragment } from '@/fragments'
  import { isRequired } from '@/functions'

  export default {
    name: 'MatchForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      valid: false,
      loadingTeams: false,
      loadingCompetitions: false,
      attributes: {
        playedOn: null,
        competition: '',
        stage: null,
        home: '',
        away: '',
        extraTime: false
      },
      rulesFor: {
        competition: [isRequired('Competition')],
        home: [isRequired('Home Team')],
        away: [isRequired('Away Team')]
      }
    }),
    computed: {
      ...mapState('matches', [
        'teamOptions'
      ]),
      title () {
        return this.record ? 'Edit Match' : 'New Match'
      },
      isHome () {
        return this.attributes.home === this.team.name
      },
      isAway () {
        return this.attributes.away === this.team.name
      },
      season () {
        const startDate = parseISO(this.team.startedOn)
        const datePlayed = parseISO(this.attributes.playedOn)
        return parseInt((datePlayed - startDate) / (525600 * 60 * 1000))
      },
      competitions () {
        return this.$store.$db().model('Competition')
          .query()
          .where('teamId', this.team.id)
          .where('season', this.season)
          .where(comp => this.attributes.competition === comp.name || !comp.champion)
          .get()
          .map(competition => competition.name)
      },
      competitionId () {
        if (this.attributes.competition) {
          const competition = this.$store.$db().model('Competition')
            .query()
            .where('teamId', this.team.id)
            .where('season', this.season)
            .where('name', this.attributes.competition)
            .first()
          return competition ? competition.id : null
        }
        return null
      },
      stages () {
        const competition = this.$store.$db().model('Competition')
          .query()
          .with('stages')
          .where('teamId', this.team.id)
          .where('season', this.season)
          .where('name', this.attributes.competition)
          .first()

        if (competition) {
          return competition.stages
            .filter(stage => !stage.table)
            .map(stage => stage.name)
        } else {
          return []
        }
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.attributes = pick(this.record, [
              'playedOn',
              'competition',
              'stage',
              'home',
              'away',
              'extraTime'
            ])
          } else {
            this.attributes.playedOn = this.team.currentlyOn
            this.attributes.extraTime = false
          }

          this.loadTeamOptions()

          if (this.competitions.length === 0) {
            this.loadCompetitions()
          }
        }
      }
    },
    methods: {
      ...mapActions({
        fetchTeamOptions: 'matches/fetchTeamOptions',
        createMatch: 'matches/create',
        updateMatch: 'matches/update',
        fetchCompetitions: 'competitions/fetch'
      }),
      setHome () {
        this.attributes.home = this.team.name
        if (this.attributes.away === this.team.name) {
          this.attributes.away = ''
        }
      },
      setAway () {
        this.attributes.away = this.team.name
        if (this.attributes.home === this.team.name) {
          this.attributes.home = ''
        }
      },
      async loadCompetitions () {
        try {
          const query = gql`
            query fetchCompetitions($teamId: ID!) {
              team(id: $teamId) {
                competitions {
                  ...CompetitionData
                  stages { ...BaseStageData }
                }
              }
            }
            ${competitionFragment}
            ${baseStageFragment}
          `

          this.loadingCompetitions = true
          await this.fetchCompetitions({ teamId: this.team.id, query })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loadingCompetitions = false
        }
      },
      async loadTeamOptions () {
        try {
          this.loadingTeams = true
          await this.fetchTeamOptions({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loadingTeams = false
        }
      },
      async submit () {
        if (this.record) {
          await this.updateMatch({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          const { id: matchId } = await this.createMatch({
            teamId: this.team.id,
            attributes: this.attributes
          })
          this.$router.push({
            name: 'teams-teamId-matches-matchId',
            params: {
              teamId: this.team.id,
              matchId
            }
          })
        }
      }
    }
  }
</script>
