<template>
  <base-form
    :submit="saveBooking"
    @reset="attributes.redCard = false"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Book Player
        </div>
        <minute-field v-model.number="minute" />
        <v-radio-group v-model="attributes.redCard">
          <v-radio
            label="Yellow Card"
            color="orange darken-2"
            :value="false"
          />
          <v-radio
            label="Red Card"
            color="red darken-2"
            :value="true"
          />
        </v-radio-group>
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            primary
            text
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { TeamAccessible, MatchAccessible } from '@/mixins'

  export default {
    name: 'CapBookingForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    props: {
      cap: { type: Object, required: true }
    },
    data: () => ({
      attributes: {
        home: true,
        playerId: null,
        playerName: '',
        redCard: false
      }
    }),
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.attributes.playerId = cap.playerId
          this.attributes.playerName = cap.name
        }
      },
      'match.home': {
        immediate: true,
        handler (home) {
          this.attributes.home = home === this.team.name
        }
      }
    },
    methods: {
      ...mapActions('bookings', {
        createBooking: 'create'
      }),
      async saveBooking () {
        await this.createBooking({
          matchId: this.match.id,
          attributes: {
            ...this.attributes,
            minute: this.minute
          }
        })
        this.$emit('submitted')
      }
    }
  }
</script>
