<template>
  <base-player-event
    :player="player"
    :event="event"
    :title="`${event.description} Injury`"
    icon="mdi-ambulance"
    color="pink"
    :dense="dense"
  >
    <template #heading>
      {{ event.startedOn | formatDate }} -
      <span v-if="event.endedOn">{{ event.endedOn | formatDate }}</span>
      <span v-else>Present</span>
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">Injured for {{ length }}</td>
      </tr>
    </template>
  </base-player-event>
</template>

<script>
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'InjuryEvent',
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    computed: {
      length () {
        return formatDistance(
          parseISO(this.event.endedOn || this.team.currentlyOn),
          parseISO(this.event.startedOn)
        )
      }
    }
  }
</script>
