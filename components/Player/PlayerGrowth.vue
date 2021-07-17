<template>
  <v-card flat>
    <v-card-text>
      <v-row class="text-center">
        <v-col cols="12">
          <div class="subheading">Overall Rating</div>
          <player-history-chart
            :player="player"
            attribute="ovr"
            color="#4caf50"
            :min="40"
            :max="100"
          />
        </v-col>
        <v-col cols="12">
          <div class="subheading">Value</div>
          <player-history-chart
            :player="player"
            attribute="value"
            color="#1976d2"
            :prefix="team.currency"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'PlayerGrowth',
    props: {
      player: { type: Object, required: true }
    },
    computed: {
      ...mapGetters('teams', {
        getTeam: 'get'
      }),
      team () {
        return this.getTeam(this.$route.params.teamId)
      }
    }
  }
</script>
