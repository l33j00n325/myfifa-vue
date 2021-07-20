<template>
  <v-container>
    <v-row
      v-if="!readonly"
      dense
    >
      <v-col>
        <match-actions :match="match" />
      </v-col>
    </v-row>
    <v-row
      v-if="match.caps.length >= 11"
      class="text-center"
      dense
    >
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
    <v-divider class="mx-3 mb-2" />
    <formation-grid :players="starters">
      <template #position="{ player }">
        <cap-view
          v-if="readonly || player.subbedOut"
          :cap="player"
          :match="match"
        />
        <cap-card
          v-else
          :cap="player"
          :match="match"
        />
      </template>
    </formation-grid>
    <v-container v-if="substitutes.length > 0 || !readonly">
      <v-row dense>
        <v-col
          cols="10"
          class="pa-0"
        >
          <div class="text-caption text-grey lighten-2">Substitutes</div>
        </v-col>
        <v-col
          v-if="!readonly"
          cols="2"
          class="pa-0"
        >
          <div class="text-caption text-grey lighten-2">vs</div>
        </v-col>
      </v-row>
      <v-row
        align="stretch"
        justify="space-around"
        dense
      >
        <v-col
          v-for="cap in firstSubstitutesRow"
          :key="cap.id"
          cols="2"
          class="text-center"
        >
          <cap-view
            v-if="readonly || cap.subbedOut"
            :cap="cap"
            :match="match"
          />
          <cap-card
            v-else
            :cap="cap"
            :match="match"
          />
        </v-col>
        <template v-if="substitutes.length < substitutesRowLength">
          <v-col
            v-for="index in firstRowPadding"
            :key="`blank-${index}`"
            cols="2"
          />
        </template>
        <v-col
          v-if="!readonly"
          cols="2"
          class="text-center"
        >
          <opponent-card :match="match" />
        </v-col>
      </v-row>
      <v-row
        v-for="row in numExtraSubstitutesRows"
        :key="row"
        align="stretch"
        justify="space-around"
        dense
      >
        <v-col
          v-for="cap in substitutesRow(row)"
          :key="cap.id"
          cols="2"
          class="text-center"
        >
          <cap-view
            v-if="readonly || cap.subbedOut"
            :cap="cap"
            :match="match"
          />
          <cap-card
            v-else
            :cap="cap"
            :match="match"
          />
        </v-col>
        <v-col
          v-for="index in (5 - substitutesRow(row).length)"
          :key="`blank-${index}`"
          cols="2"
        />
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import { matchPositions } from '@/constants'

  export default {
    name: 'MatchLineup',
    mixins: [
      TeamAccessible
    ],
    props: {
      match: { type: Object, required: true }
    },
    computed: {
      readonly () {
        return this.team.currentlyOn !== this.match.playedOn
      },
      starters () {
        return this.match.caps.filter(c => c.start === 0)
      },
      substitutes () {
        return this.match.caps.filter(c => c.start > 0)
      },
      substitutesRowLength () {
        return this.readonly ? 5 : 4
      },
      firstSubstitutesRow () {
        return this.substitutes.slice(0, this.substitutesRowLength)
      },
      firstRowPadding () {
        return this.substitutesRowLength - this.substitutes.length
      },
      numExtraSubstitutesRows () {
        return Math.floor(this.substitutes.length / this.substitutesRowLength)
      },
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

        this.match.caps.forEach(cap => {
          if (matchPositions[cap.pos] === positionType) {
            playerIds.push(cap.playerId)
          }
        })

        const totalOvr = this.$store.$db().model('Player')
          .query()
          .whereIdIn(playerIds)
          .get()
          .reduce(
            (sum, player) => sum + player.ovrAt(this.match.playedOn),
            0
          )

        return Math.round(totalOvr / playerIds.length)
      },
      substitutesRow (i) {
        return this.substitutes.slice(
          i * this.substitutesRowLength,
          (i + 1) * this.substitutesRowLength
        )
      }
    }
  }
</script>
