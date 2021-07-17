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
  import { mapState } from 'vuex'
  import filter from 'lodash.filter'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'SquadGrid',
    mixins: [
      TeamAccessible
    ],
    computed: {
      ...mapState('squads', {
        squadRecords: 'records'
      }),
      squads () {
        return filter(this.squadRecords, { teamId: this.team.id })
      }
    }
  }
</script>
