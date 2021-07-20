<template>
  <base-player-event
    :player="player"
    :event="event"
    title="Contract"
    icon="mdi-file-document"
    color="blue"
    :dense="dense"
  >
    <template #heading>
      {{ event.startedOn | formatDate }} - {{ event.endedOn | formatDate }}
      <span
        v-if="event.conclusion && event.endedOn <= team.currentlyOn"
        class="pl-1"
        v-text="`(${event.conclusion})`"
      />
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Wage</td>
        <td class="pl-1">
          {{ event.wage | formatMoney(team.currency) }}
        </td>
      </tr>
      <tr>
        <td class="font-weight-bold">Signing Bonus</td>
        <td class="pl-1">
          {{ event.signingBonus | formatMoney(team.currency) }}
        </td>
      </tr>
      <tr v-if="event.performanceBonus">
        <td class="font-weight-bold">Performance Bonus</td>
        <td class="pl-1">
          {{ event.performanceBonus | formatMoney(team.currency) }}
          if {{ event.bonusReq }} {{ event.bonusReqType }}
        </td>
      </tr>
      <tr v-if="event.releaseClause">
        <td class="font-weight-bold">Release Clause</td>
        <td class="pl-1">
          {{ event.releaseClause | formatMoney(team.currency) }}
        </td>
      </tr>
    </template>
  </base-player-event>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'ContractEvent',
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    }
  }
</script>
