<template>
  <base-match-event
    :match="match"
    :event="event"
    :readonly="readonly"
  >
    <div>
      <v-icon
        :color="color"
        small
        left
        v-text="`mdi-${icon}`"
      />
      {{ event.playerName }}
    </div>
    <div>
      <v-icon
        color="green"
        small
        left
        v-text="'mdi-subdirectory-arrow-right'"
      />
      {{ event.replacedBy }}
    </div>
  </base-match-event>
</template>

<script>
  export default {
    name: 'SubstitutionEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      color () {
        return this.event.injury ? 'pink' : 'orange'
      },
      icon () {
        return this.event.injury ? 'ambulance' : 'subdirectory-arrow-left'
      }
    }
  }
</script>
