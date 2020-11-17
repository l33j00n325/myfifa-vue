<template>
  <v-card>
    <v-toolbar flat>
      <v-btn
        outlined
        class="mr-4"
        color="grey darken-2"
        @click="day = team.currently_on"
      >
        Today
      </v-btn>
      <v-btn
        icon
        text
        small
        color="grey darken-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon small>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        icon
        text
        small
        color="grey darken-2"
        @click="$refs.calendar.next()"
      >
        <v-icon small>mdi-chevron-right</v-icon>
      </v-btn>
      <v-toolbar-title
        v-if="$refs.calendar"
        class="ml-4"
      >
        {{ $refs.calendar.title }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-calendar
        ref="calendar"
        v-model="day"
        type="month"
        :now="team.currently_on"
        :start="team.started_on"
        :events="events"
        event-start="played_on"
        :event-color="getEventColor"
        :show-month-on-first="false"
        @click:event="viewMatch"
      />
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        min-width="300"
        offset-y
        offset-overflow
      >
        <match-card
          :match="selectedEvent"
          :title="selectedEvent.opponent"
          :color="selectedEvent.color"
        />
      </v-menu>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Match } from '@/models'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'TeamCalendar',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      day: new Date(),
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false
    }),
    computed: {
      matches () {
        return Match
          .query()
          .with('team')
          .where('team_id', this.team.id)
          .get()
      },
      events () {
        return this.matches.map(match => ({
          ...match,
          name: `${match.score} — ${match.opponent}`,
          opponent: match.opponent,
          color: match.resultColor,
          link: match.link
        }))
      }
    },
    mounted () {
      this.day = this.team.currently_on
    },
    methods: {
      viewMatch ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
      },
      getEventColor (event) {
        return event.color
      }
    }
  }
</script>
