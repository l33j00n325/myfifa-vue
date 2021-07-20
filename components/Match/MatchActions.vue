<template>
  <div class="text-center">
    <cap-form
      v-if="match.caps.length < 11"
      :match="match"
      class="d-inline-block"
    />
    <match-squad-applier :match="match" />
    <match-squad-saver :match="match" />
    <penalty-shootout-form
      v-if="!match.penaltyShootout"
      :match="match"
      color="indigo"
      class="d-inline-block"
    />
  </div>
</template>

<script>
  export default {
    name: 'MatchActions',
    props: {
      match: { type: Object, required: true }
    }
  }
</script>
