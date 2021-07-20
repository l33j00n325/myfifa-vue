<template>
  <v-menu
    v-model="calendar"
    :close-on-content-click="false"
    transition="scale-transition"
    :origin="origin"
    :class="menuClass"
  >
    <template #activator="{ on }">
      <slot
        :on="on"
        :date="currentDate"
      >
        <v-btn
          class="mb-1"
          text
          v-on="on"
        >
          <v-icon left>mdi-calendar</v-icon>
          {{ currentDate | formatDate('MMM dd') }}
        </v-btn>
      </slot>
    </template>
    <v-date-picker
      v-model="currentDate"
      color="cyan"
      :min="seasonStart"
      :max="seasonEnd"
      @input="calendar = false"
    />
  </v-menu>
</template>

<script>
  import { mapActions } from 'vuex'
  import { format, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'TeamDatePicker',
    mixins: [
      TeamAccessible
    ],
    props: {
      menuClass: { type: String, default: 'd-inline-block' },
      origin: { type: String, default: 'top right' }
    },
    data: () => ({
      calendar: false,
      currentDate: format(new Date(), 'yyyy-MM-dd')
    }),
    computed: {
      formattedDate () {
        return format(parseISO(this.currentDate), 'MMM dd, yyyy')
      }
    },
    watch: {
      'team.currentlyOn': {
        handler (currentlyOn) {
          this.currentDate = currentlyOn
        },
        immediate: true
      },
      async currentDate (val, oldVal) {
        if (oldVal) {
          await this.updateTeam({
            id: this.team.id,
            attributes: { currentlyOn: val }
          })
          this.calendar = false
        }
      }
    },
    methods: mapActions('teams', {
      updateTeam: 'update'
    })
  }
</script>
