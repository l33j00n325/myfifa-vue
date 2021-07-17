<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="`/teams/${teamId}/seasons/${competition.season}`"
          nuxt
          v-text="'View Season'"
        />
      </v-col>
      <v-col
        class="text-center"
        cols="12"
      >
        <div class="subheading">{{ competitionSeason }}</div>
        <div class="text-h4 primary--text">
          <fitty-text :text="competition.name" />
        </div>
        <div
          v-if="readonly"
          class="title"
        >
          <v-icon
            color="yellow darken-2"
            left
            v-text="'mdi-crown'"
          />
          {{ competition.champion }}
          <v-icon
            color="yellow darken-2"
            right
            v-text="'mdi-crown'"
          />
        </div>
      </v-col>
      <v-col
        v-if="!readonly"
        class="text-center"
        cols="12"
      >
        <competition-form
          :record="competition"
          color="orange"
        >
          <template #default="{ on }">
            <v-btn
              class="my-1"
              dark
              color="orange"
              v-on="on"
              v-text="'Edit'"
            />
          </template>
        </competition-form>
        <competition-form
          :record="competition"
          color="red"
          close
        >
          <template #default="{ on }">
            <v-btn
              class="my-1"
              dark
              color="red"
              v-on="on"
              v-text="'Close'"
            />
          </template>
        </competition-form>
        <stage-form
          :competition="competition"
          color="teal"
        />
        <record-remove
          :record="competition"
          store="competitions"
          :label="`${competitionSeason} ${competition.name}`"
        >
          <template #default="{ on }">
            <v-btn
              class="my-1"
              dark
              v-on="on"
              v-text="'Remove'"
            />
          </template>
        </record-remove>
      </v-col>

      <!-- Table Stages -->
      <v-col
        v-if="tables.length > 0"
        cols="12"
      >
        <v-card outlined>
          <v-card-text>
            <v-tabs
              v-model="table"
              centered
              center-active
            >
              <v-tab
                v-for="table in tables"
                :key="table.id"
              >
                {{ table.name }}
              </v-tab>
            </v-tabs>
            <v-tabs-items
              v-model="table"
              touchless
            >
              <v-tab-item
                v-for="table in tables"
                :key="table.id"
              >
                <table-stage
                  :table="table"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Elimination Round Stages -->
      <v-col
        v-if="rounds.length > 0"
        cols="12"
      >
        <v-card outlined>
          <v-card-text>
            <v-tabs
              centered
              center-active
            >
              <v-tab
                v-for="round in rounds"
                :key="round.id"
              >
                {{ round.name }}
              </v-tab>
              <v-tab-item
                v-for="round in rounds"
                :key="round.id"
              >
                <round-stage
                  :round="round"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'

  export default {
    name: 'CompetitionPage',
    mixins: [
      CompetitionAccessible
    ],
    data: () => ({
      table: 0
    }),
    computed: {
      title () {
        return this.competition
          ? `${this.competition.name} (${this.competitionSeason})`
          : 'Competition'
      },
      stages () {
        return this.competition.stages
      },
      tables () {
        return this.stages.filter(stage => stage.table)
      },
      rounds () {
        return this.stages.filter(stage => !stage.table)
      },
      readonly () {
        return this.competition.champion &&
          this.competition.champion.length > 0
      },
      competitionSeason () {
        return this.seasonLabel(this.competition.season)
      }
    },
    watch: {
      competition () {
        if (!this.competition) {
          this.$router.push({
            name: 'teams-teamId-seasons-season',
            params: {
              teamId: this.team.id,
              season: this.season
            }
          })
        }
      }
    },
    async fetch () {
      await this.fetchCompetition(this.competitionId)
      this.setPage({
        title: this.title,
        headline: this.title
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      ...mapActions({
        fetchCompetition: 'competitions/get',
        fetchStages: 'stages/fetch'
      })
    }
  }
</script>

<style scoped>
  .v-card + .v-card {
    margin-top: 1rem;
  }
</style>
