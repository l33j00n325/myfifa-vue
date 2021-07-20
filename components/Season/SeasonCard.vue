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
        :to="link"
        dark
        text
        nuxt
      >
        View Season
      </v-btn>
    </v-toolbar>
    <v-list
      nav
      dense
    >
      <v-subheader>Competitions</v-subheader>
      <v-list-item
        v-for="competition in competitions"
        :key="competition.id"
        :to="competition.link"
        nuxt
      >
        <v-list-item-icon>
          <v-icon :color="competition.statusColor">
            {{ competition.statusIcon }}
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
  import { addYears, format, parseISO } from 'date-fns'

  export default {
    name: 'SeasonCard',
    props: {
      season: { type: Number, required: true }
    },
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      },
      competitions () {
        return this.$store.$db().model('Competition')
          .query()
          .with('team')
          .where('teamId', this.team.id)
          .where('season', this.season)
          .get()
      },
      seasonLabel () {
        let start = addYears(parseISO(this.team.startedOn), this.season)
        const end = addYears(start, 1)
        return `${format(start, 'yyyy')} - ${format(end, 'yyyy')}`
      },
      link () {
        return {
          name: 'teams-teamId-seasons-season',
          params: {
            teamId: this.team.id,
            season: this.season
          }
        }
      }
    }
  }
</script>
