<template>
  <div>
    <player-form
      :record="player"
      color="orange"
    >
      <template #default="{ on }">
        <tooltip-button
          label="Edit"
          icon="mdi-pencil"
          color="orange"
          :on="on"
        />
      </template>
    </player-form>
    <transfer-form :player="player" />
    <loan-form
      :player="player"
      :record="player.status === 'Loaned' ? loan : null"
    />
    <contract-form :player="player" />
    <template v-if="player.isActive">
      <injury-form
        :player="player"
        :record="player.status === 'Injured' ? injury : null"
      />
      <player-retire :player="player" />
      <player-release :player="player" />
    </template>
    <record-remove
      :record="player"
      store="players"
      :label="player.name"
    />
  </div>
</template>

<script>
  export default {
    name: 'PlayerAction',
    props: {
      player: { type: Object, required: true }
    },
    computed: {
      injury () {
        return this.$store.$db().model('Injury')
          .query()
          .where('playerId', this.player.id)
          .last()
      },
      loan () {
        return this.$store.$db().model('Loan')
          .query()
          .where('playerId', this.player.id)
          .last()
      }
    }
  }
</script>
