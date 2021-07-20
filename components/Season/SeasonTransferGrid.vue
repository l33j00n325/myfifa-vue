<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    sort-by="date"
    :mobile-breakpoint="0"
    hide-default-footer
    class="mt-2"
  >
    <template #item="{ item }">
      <tr>
        <td class="stick-left">
          <v-btn
            :to="`/teams/${teamId}/players/${item.playerId}`"
            nuxt
            small
            text
            color="primary"
            class="text-capitalize"
            v-text="item.name"
          />
        </td>
        <td class="text-center">{{ item.pos }}</td>
        <td class="text-center">{{ item.date | formatDate }}</td>
        <td class="text-center">
          <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
        </td>
        <td>{{ item.origin }}</td>
        <td class="text-right">
          <span
            v-if="item.fee"
            :class="`${item.iconColor}--text`"
          >
            {{ item.fee | formatMoney(team.currency, ' ') }}
            <span v-if="item.addonClause">(+{{ item.addonClause }}%)</span>
          </span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
  import { format, parseISO, addYears } from 'date-fns'
  import { positions } from '@/constants'

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }

  export default {
    name: 'SeasonTransferGrid',
    props: {
      transferActivity: { type: Object, required: true },
      season: { type: Number, required: true }
    },
    data: () => ({
      headers: [
        { text: 'Player', value: 'name', class: 'stick-left' },
        { text: 'Pos', value: 'pos', align: 'center', sort: sortPos },
        { text: 'Date', value: 'date', align: 'center' },
        { text: '', value: 'icon', align: 'center', sortable: false },
        { text: 'From/To', value: 'origin' },
        { text: 'Fee', value: 'fee', align: 'end', class: 'text-right' }
      ]
    }),
    computed: {
      teamId () {
        return parseInt(this.$route.params.teamId)
      },
      team () {
        return this.$store.$db().model('Team').find(this.teamId)
      },
      arrivals () {
        return this.transferActivity.arrivals.filter(arrival => {
          return !this.transfers.some(transfer => {
            return transfer.playerId === arrival.playerId &&
              transfer.date === arrival.startedOn &&
              transfer.iconColor === 'green'
          }) && !this.loans.some(loan => {
            return loan.playerId === arrival.playerId &&
              loan.date === arrival.startedOn &&
              loan.iconColor === 'indigo'
          })
        }).map(arrival => {
          const player = this.$store.$db().model('Player')
            .find(arrival.playerId)

          return {
            playerId: arrival.playerId,
            name: player.name,
            pos: player.pos,
            date: arrival.startedOn,
            icon: `mdi-${player.youth ? 'school' : 'file-document-outline'}`,
            iconColor: player.youth ? 'cyan' : 'blue',
            origin: player.youth ? 'Youth Academy' : 'Free Agent'
          }
        })
      },
      departures () {
        return this.transferActivity.departures.map(departure => {
          const player = this.$store.$db().model('Player')
            .find(departure.playerId)
          return {
            playerId: departure.playerId,
            name: player.name,
            pos: player.pos,
            date: departure.endedOn,
            icon: 'mdi-exit-run',
            iconColor: 'red',
            origin: `(${player.conclusion || 'Expired'})`
          }
        })
      },
      transfers () {
        return this.transferActivity.transfers.map(transfer => {
          const player = this.$store.$db().model('Player')
            .find(transfer.playerId)
          const transferOut = this.team.name === transfer.origin
          return {
            playerId: transfer.playerId,
            name: player.name,
            pos: player.pos,
            date: transfer.movedOn,
            icon: `mdi-airplane-${transferOut ? 'takeoff' : 'landing'}`,
            iconColor: transferOut ? 'red' : 'green',
            origin: transferOut ? transfer.destination : transfer.origin,
            fee: transfer.fee,
            addonClause: transfer.addonClause
          }
        })
      },
      loans () {
        return this.transferActivity.loans.reduce((loans, loan) => {
          const player = this.$store.$db().model('Player')
            .find(loan.playerId)
          const loanOut = this.team.name === loan.origin
          const row = {
            playerId: loan.playerId,
            name: player.name,
            pos: player.pos,
            icon: 'mdi-transit-transfer'
          }
          if (loan.startedOn < this.seasonEnd) {
            loans.push({
              ...row,
              date: loan.startedOn,
              iconColor: `${loanOut ? 'deep-orange' : 'light-green'}`,
              origin: loanOut ? loan.destination : loan.origin
            })
          }
          if (loan.endedOn >= this.seasonStart) {
            loans.push({
              ...row,
              date: loan.endedOn,
              iconColor: `${loanOut ? 'light-green' : 'deep-orange'}`,
              origin: loanOut ? null : loan.destination
            })
          }
          return loans
        }, [])
      },
      rows () {
        // return []
        return [
          ...this.arrivals,
          ...this.departures,
          ...this.transfers,
          ...this.loans
        ].sort((a, b) => a.date - b.date)
      },
      seasonStart () {
        const date = parseISO(this.team.startedOn)
        return format(addYears(date, this.season), 'yyyy-MM-dd')
      },
      seasonEnd () {
        const date = parseISO(this.seasonStart)
        return format(addYears(date, 1), 'yyyy-MM-dd')
      }
    }
  }
</script>
