<template>
  <v-card>
    <v-toolbar
      color="primary"
      dense
    >
      <v-toolbar-title class="font-weight-light white--text">
        {{ squad.name }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row
        class="text-center"
        dense
      >
        <v-col cols="12">
          <squad-form
            :record="squad"
            color="orange"
            class="d-inline-block"
          >
            <template #default="{ on }">
              <tooltip-button
                label="Edit"
                icon="mdi-pencil"
                color="orange"
                :on="on"
              />
            </template>
          </squad-form>
          <record-remove
            :record="squad"
            store="squads"
            :label="`Squad: ${ squad.name }`"
            small
          />
        </v-col>
        <v-col>
          <div class="text-h4 primary--text">{{ defOVR }}</div>
          <div class="subheading">DEF</div>
        </v-col>
        <v-col>
          <div class="text-h4 success--text">{{ midOVR }}</div>
          <div class="subheading">MID</div>
        </v-col>
        <v-col>
          <div class="text-h4 warning--text">{{ attOVR }}</div>
          <div class="subheading">ATT</div>
        </v-col>
      </v-row>
      <v-divider class="mx-3" />
      <formation-grid :players="squad.squadPlayers">
        <template #position="{ player }">
          <v-icon>mdi-account</v-icon>
          <div :class="['player', statusColor(player.playerId)]">
            {{ nameOf(player.playerId) }}
          </div>
        </template>
      </formation-grid>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'SquadCard',
    props: {
      squad: { type: Object, required: true }
    },
    computed: {
      defOVR () {
        return this.avgOVR('DEF')
      },
      midOVR () {
        return this.avgOVR('MID')
      },
      attOVR () {
        return this.avgOVR('ATT')
      }
    },
    methods: {
      avgOVR (positionType) {
        let playerIds = []

        this.squad.squadPlayers.forEach(squadPlayer => {
          if (squadPlayer.positionType === positionType) {
            playerIds.push(squadPlayer.playerId)
          }
        })

        const totalOvr = this.$store.$db().model('Player')
          .query()
          .whereIdIn(playerIds)
          .sum('ovr')

        return Math.round(totalOvr / playerIds.length)
      },
      nameOf (playerId) {
        const player = this.$store.$db().model('Player').find(playerId)
        return player ? player.name : ''
      },
      statusColor (playerId) {
        const player = this.$store.$db().model('Player').find(playerId)
        if (player && player.status === 'Active') {
          return ''
        } else {
          return 'red--text'
        }
      }
    }
  }
</script>

<style scoped>
  .player {
    font-size: 0.8em;
    line-height: 1;
  }
</style>
