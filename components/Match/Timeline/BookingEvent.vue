<template>
  <base-match-event
    :match="match"
    :event="event"
    :readonly="readonly"
  >
    <v-icon
      :color="color"
      small
      left
      v-text="'mdi-book'"
    />
    {{ event.playerName }}
  </base-match-event>
</template>

<script>
  export default {
    name: 'BookingEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      color () {
        return this.event.redCard ? 'red' : 'amber'
      }
    }
  }
</script>
