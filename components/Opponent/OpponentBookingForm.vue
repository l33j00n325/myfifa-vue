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
        <v-text-field
          v-model="attributes.playerName"
          label="Player"
          prepend-icon="mdi-account"
          :rules="rules.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
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
            v-text="'Save'"
          />
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { TeamAccessible, MatchAccessible } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'CapBookingForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    data: () => ({
      attributes: {
        home: true,
        playerName: '',
        redCard: false
      }
    }),
    computed: {
      rules () {
        return {
          playerName: [isRequired('Player')]
        }
      }
    },
    watch: {
      'match.home': {
        immediate: true,
        handler (home) {
          this.attributes.home = home !== this.team.name
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
