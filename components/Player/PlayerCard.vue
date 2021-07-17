<template>
  <v-card outlined>
    <v-card-title class="text-subtitle-1 d-block text-center">
      <span :class="`font-weight-light ${color}--text`">
        {{ player.name }}
      </span>
    </v-card-title>
    <v-divider class="mx-3" />
    <v-card-actions>
      <v-btn
        :to="player.link"
        nuxt
        :color="color"
        block
        text
      >
        View Player
      </v-btn>
    </v-card-actions>
    <v-card-text class="text-center">
      <v-row>
        <v-col cols="3">
          <div class="text-h4">{{ player.pos }}</div>
          <div class="subheading">Position</div>
        </v-col>
        <v-col cols="3">
          <div class="text-h4">{{ player.secPos | listArray }}</div>
          <div class="subheading">
            <fitty-text text="Secondary Position(s)" />
          </div>
        </v-col>
        <v-col cols="3">
          <div class="text-h4">{{ player.age }}</div>
          <div class="subheading">Age</div>
        </v-col>
        <v-col cols="3">
          <v-icon
            class="text-h4"
            :color="player.statusColor"
          >
            mdi-{{ player.statusIcon }}
          </v-icon>
          <div class="subheading">{{ player.status || 'Status' }}</div>
        </v-col>
        <v-col cols="6">
          <div class="text-h4 success--text">{{ player.ovr }}</div>
          <div class="subheading">OVR</div>
        </v-col>
        <v-col cols="6">
          <div class="text-h4 primary--text">
            {{ player.value | formatMoney(team.currency) }}
          </div>
          <div class="subheading">Value</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'PlayerCard',
    props: {
      playerId: { type: [Number, String], required: true },
      color: { type: String, default: 'info' }
    },
    computed: {
      ...mapGetters('teams', {
        getTeam: 'get'
      }),
      player () {
        return this.$store.$db().model('Player').find(this.playerId)
      },
      team () {
        return this.getTeam(this.$route.params.teamId)
      }
    }
  }
</script>
