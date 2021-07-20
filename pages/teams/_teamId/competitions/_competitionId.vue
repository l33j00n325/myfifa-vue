<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="competition.linkToSeason"
          nuxt
        >
          View Season
        </v-btn>
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
          >
            mdi-crown
          </v-icon>
          {{ competition.champion }}
          <v-icon
            color="yellow darken-2"
            right
          >
            mdi-crown
          </v-icon>
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
            >
              Edit
            </v-btn>
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
            >
              Close
            </v-btn>
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
            >
              Remove
            </v-btn>
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
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import { competitionFragment, stageFragment } from '@/fragments'

  export default {
    name: 'CompetitionPage',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      table: 0
    }),
    computed: {
      competitionId () {
        return parseInt(this.$route.params.competitionId)
      },
      competition () {
        return this.$store.$db().model('Competition')
          .query()
          .with('stages.tableRows')
          .with('stages.fixtures.legs')
          .find(this.competitionId)
      },
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
      const query = gql`
        query fetchCompetition($id: ID!) {
          competition(id: $id) {
            ...CompetitionData
            stages { ...StageData }
          }
        }
        ${competitionFragment}
        ${stageFragment}
      `

      const { competition } = await this.$graphql.default.request(query, {
        id: this.competitionId
      })
      await this.$store.$db().model('Competition').insertOrUpdate({ data: competition })

      this.setPage({
        title: this.title,
        headline: this.title
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>

<style scoped>
  .v-card + .v-card {
    margin-top: 1rem;
  }
</style>
