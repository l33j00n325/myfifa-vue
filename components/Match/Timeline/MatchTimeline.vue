<template>
  <v-timeline dense>
    <template v-if="events.length > 0 || match.penaltyShootout">
      <template v-for="event in events">
        <component
          :is="`${event.type}-event`"
          :key="`${event.type}-${event.id}`"
          :event="event"
          :match="match"
          :readonly="readonly"
        />
      </template>
    </template>
    <v-timeline-item
      v-else
      color="grey"
      icon="mdi-timer"
      fill-dot
    >
      <div class="mt-2">No Match Events</div>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  import orderBy from 'lodash.orderby'
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
    props: {
      match: { type: Object, required: true }
    },
    computed: {
      events () {
        const events = orderBy([
          ...this.match.bookings,
          ...this.match.substitutions,
          ...this.match.goals
        ], ['minute', 'createdAt'], ['asc', 'asc'])

        if (this.match.penaltyShootout) {
          events.push(this.match.penaltyShootout)
        }

        return events
      },
      readonly () {
        return this.team.currentlyOn !== this.match.playedOn
      }
    }
  }
</script>

<style scoped>
  .v-card > .container {
    padding: 8px;
  }
</style>
