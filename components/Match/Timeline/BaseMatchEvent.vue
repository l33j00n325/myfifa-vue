<template>
  <v-timeline-item
    :color="itemColor"
    fill-dot
  >
    <template #icon>
      <v-sheet
        dark
        color="transparent"
        v-text="`${minute}'`"
      />
    </template>
    <h2 class="font-weight-light my-0">
      <span
        :class="`text-caption text-truncate mx-1 ${itemColor}--text`"
        v-text="itemTitle"
      />
      <template v-if="!readonly">
        <component
          :is="`${event.type}-form`"
          :match="match"
          :record="event"
        >
          <template #default="{ on }">
            <tooltip-button
              icon="mdi-pencil"
              color="orange"
              :label="`Edit ${buttonLabel}`"
              :on="on"
            />
          </template>
        </component>
        <record-remove
          :record="event"
          :store="store"
          :label="buttonLabel"
        />
      </template>
    </h2>

    <slot />
  </v-timeline-item>
</template>

<script>
  export default {
    name: 'BaseMatchEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      itemColor () {
        if (this.event.type === 'penalty-shootout') {
          return 'indigo'
        } else {
          return this.event.home ? 'teal' : 'purple'
        }
      },
      itemTitle () {
        if (this.event.type === 'penalty-shootout') {
          return 'Penalty Shootout'
        } else {
          return this.event.home ? this.match.home : this.match.away
        }
      },
      minute () {
        if (this.event.type === 'penalty-shootout') {
          return this.match.extraTime ? 120 : 90
        } else {
          return this.event.minute
        }
      },
      buttonLabel () {
        return this.event.type === 'penalty-shootout'
          ? 'Penalty Shootout'
          : `${this.event.type[0].toUpperCase()}${this.event.type.slice(1)}`
      },
      store () {
        return this.event.type === 'penalty-shootout'
          ? 'penaltyShootout'
          : `${this.event.type}s`
      }
    }
  }
</script>
