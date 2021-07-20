<template>
  <v-row>
    <v-col
      v-for="squad in squads"
      :key="squad.id"
      cols="12"
      md="6"
    >
      <squad-card :squad="squad" />
    </v-col>
  </v-row>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'SquadGrid',
    mixins: [
      TeamAccessible
    ],
    computed: {
      squads () {
        return this.$store.$db().model('Squad')
          .query()
          .with('squadPlayers')
          .where('teamId', this.team.id)
          .get()
      }
    }
  }
</script>
