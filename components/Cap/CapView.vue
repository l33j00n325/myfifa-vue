<template>
  <div class="cap">
    <div class="font-weight-bold">{{ cap.pos }}</div>
    <v-dialog width="500">
      <template #activator="{ on }">
        <a
          class="player-name"
          v-on="on"
        >
          {{ player.name }}
        </a>
      </template>
      <player-card :player-id="cap.playerId" />
    </v-dialog>
    <cap-events
      :cap="cap"
      :match="match"
    />
  </div>
</template>

<script>
  export default {
    name: 'CapView',
    props: {
      cap: { type: Object, required: true },
      match: { type: Object, required: true }
    },
    computed: {
      player () {
        return this.$store.$db().model('Player').find(this.cap.playerId)
      }
    }
  }
</script>

<style scoped lang="scss">
  .cap {
    line-height: 1.5;

    a.player-name {
      color: inherit;
      font-size: 0.8em;
      line-height: 1;
      display: inline-block;
    }
  }
</style>
