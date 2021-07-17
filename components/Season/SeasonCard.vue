<template>
  <v-card>
    <v-toolbar
      color="blue"
      dark
      dense
    >
      <v-toolbar-title class="font-weight-light">
        {{ seasonLabel }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        :to="`/teams/${team.id}/seasons/${season}`"
        dark
        text
        nuxt
        v-text="'View Season'"
      />
    </v-toolbar>
    <v-list
      nav
      dense
    >
      <v-subheader>Competitions</v-subheader>
      <v-list-item
        v-for="competition in competitions"
        :key="competition.id"
        :to="`/teams/${team.id}/competitions/${competition.id}`"
        nuxt
      >
        <v-list-item-icon>
          <v-icon :color="statusColor(competition)">
            {{ statusIcon(competition) }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ competition.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import filter from 'lodash.filter'

  export default {
    name: 'SeasonCard',
    props: {
      season: { type: Number, required: true }
    },
    computed: {
      ...mapGetters({
        getTeam: 'teams/get',
        getCompetition: 'competitions/get'
      }),
      team () {
        return this.getTeam(this.$route.params.teamId)
      },
      competitions () {
        const competitions = (this.team.competitionsIds || []).map(
          competitionId => this.getCompetition(competitionId)
        )
        return filter(competitions, { season: this.season })
      },
      seasonLabel () {
        let start = addYears(parseISO(this.team.startedOn), this.season)
        const end = addYears(start, 1)
        return `${format(start, 'yyyy')} - ${format(end, 'yyyy')}`
      }
    },
    methods: {
      statusIcon (competition) {
        if (competition.champion === this.team.name) {
          return 'mdi-trophy'
        } else if (competition.champion) {
          return 'mdi-check'
        } else {
          return 'mdi-timelapse'
        }
      },
      statusColor (competition) {
        if (competition.champion === this.team.name) {
          return 'yellow darken-2'
        } else if (competition.champion) {
          return 'green'
        } else {
          return 'gray'
        }
      }
    }
  }
</script>
