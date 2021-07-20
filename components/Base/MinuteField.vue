<template>
  <v-text-field
    label="Minute"
    prepend-icon="mdi-timer"
    type="number"
    :rules="rules"
    :value="value"
    @input="updateValue"
  />
</template>

<script>
  import { isRequired, inRange } from '@/functions'

  export default {
    name: 'MinuteField',
    props: {
      value: { type: [String, Number], default: null }
    },
    computed: {
      match () {
        return this.$store.$db().model('Match').find(this.$route.params.matchId)
      },
      rules () {
        const label = 'Minute'
        return [
          isRequired(label),
          inRange(label, [1, this.match.extraTime ? 120 : 90])
        ]
      }
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
