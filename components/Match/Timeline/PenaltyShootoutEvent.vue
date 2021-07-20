<template>
  <base-match-event
    :match="match"
    :event="event"
    :readonly="readonly"
  >
    <div :class="{ 'font-weight-bold': match.home === winner }">
      {{ event.homeScore }} - {{ match.home }}
    </div>
    <div :class="{ 'font-weight-bold': match.away === winner }">
      {{ event.awayScore }} - {{ match.away }}
    </div>
  </base-match-event>
</template>

<script>
  export default {
    name: 'PenaltyShootoutEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      winner () {
        return this.event.homeScore > this.event.awayScore
          ? this.match.home
          : this.match.away
      }
    }
  }
</script>
