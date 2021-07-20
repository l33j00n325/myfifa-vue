<template>
  <base-player-event
    :player="player"
    :event="event"
    :title="title"
    :icon="icon"
    :color="color"
    :dense="dense"
  >
    <template #heading>
      {{ event.movedOn | formatDate }}
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Origin</td>
        <td class="pl-1">{{ event.origin }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Destination</td>
        <td class="pl-1">{{ event.destination }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Transfer Fee</td>
        <td class="pl-1">{{ event.fee | formatMoney(team.currency) }}</td>
      </tr>
      <tr v-if="event.tradedPlayer">
        <td class="font-weight-bold">Traded Player</td>
        <td class="pl-1">{{ event.tradedPlayer }}</td>
      </tr>
      <tr v-if="event.addonClause">
        <td class="font-weight-bold">Add-On Clause</td>
        <td class="pl-1">{{ event.addonClause }}%</td>
      </tr>
    </template>
  </base-player-event>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'TransferEvent',
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    computed: {
      transferOut () {
        return this.event.origin === this.team.name
      },
      title () {
        return this.transferOut
          ? `Transfer to ${this.event.destination}`
          : `Transfer from ${this.event.origin}`
      },
      icon () {
        return `mdi-airplane-${this.transferOut ? 'takeoff' : 'landing'}`
      },
      color () {
        return this.transferOut ? 'red' : 'green'
      }
    }
  }
</script>
