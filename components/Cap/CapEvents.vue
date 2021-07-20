<template>
  <div>
    <v-badge
      v-if="numGoals > 0"
      bottom
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="counter font-weight-black">{{ numGoals }}</div>
      </template>
      <v-icon
        color="blue"
        small
      >
        mdi-soccer
      </v-icon>
    </v-badge>
    <v-badge
      v-if="numAssists > 0"
      bottom
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="counter font-weight-black">{{ numAssists }}</div>
      </template>
      <v-icon
        color="light-blue accent-1"
        small
      >
        mdi-human-greeting
      </v-icon>
    </v-badge>
    <v-icon
      v-if="booking"
      :color="booking"
      small
    >
      mdi-book
    </v-icon>
    <v-icon
      v-if="injured"
      color="pink"
      small
    >
      mdi-ambulance
    </v-icon>
    <v-icon
      v-if="cap.subbedOut"
      color="orange darken-2"
      small
    >
      mdi-subdirectory-arrow-left
    </v-icon>
  </div>
</template>

<script>
  export default {
    name: 'CapEvents',
    props: {
      cap: { type: Object, required: true },
      match: { type: Object, required: true }
    },
    computed: {
      numGoals () {
        return this.match.goals
          .filter(g => g.playerId === this.cap.playerId && !g.ownGoal)
          .length
      },
      numAssists () {
        return this.match.goals
          .filter(g => g.assistId === this.cap.playerId)
          .length
      },
      booking () {
        const bookings = this.match.bookings.filter(booking =>
          booking.playerId === this.cap.playerId
        )

        if (bookings.some(b => b.redCard)) {
          return 'red'
        } else if (bookings.length > 0) {
          return 'yellow darken-2'
        } else {
          return null
        }
      },
      injured () {
        return this.match.substitutions.some(s =>
          s.playerId === this.cap.playerId && s.injury
        )
      }
    }
  }
</script>

<style scoped lang="scss">
  .counter {
    color: black;

    .theme--dark & {
      color: white;
    }
  }
</style>
