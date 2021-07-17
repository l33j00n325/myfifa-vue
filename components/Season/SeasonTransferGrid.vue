<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    :mobile-breakpoint="0"
    disable-sort
    hide-default-footer
  >
    <template #item.movedOn="{ item }">
      {{ item.movedOn | formatDate }}
    </template>
    <template #item.name="{ item }">
      <v-btn
        :to="playerLink(item)"
        nuxt
        small
        text
        color="primary"
        class="text-capitalize"
      >
        {{ item.name }}
      </v-btn>
    </template>
    <template #item.dir="{ item }">
      <v-icon :color="item.dir === 'in' ? 'green' : 'red'">
        mdi-airplane-{{ item.dir === 'in' ? 'landing' : 'takeoff' }}
      </v-icon>
    </template>
    <template #item.fee="{ item }">
      <span :class="`${item.dir === 'in' ? 'red' : 'green'}--text`">
        {{ item.fee | formatMoney }}
        <span v-if="item.addonClause">(+{{ item.addonClause }}%)</span>
      </span>
    </template>
  </v-data-table>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'

  export default {
    name: 'SeasonTransferGrid',
    props: {
      season: { type: [String, Number], required: true }
    },
    data: () => ({
      headers: [
        { text: 'Effective Date', value: 'movedOn' },
        { text: 'Player', value: 'name' },
        { text: '', value: 'dir', align: 'center' },
        { text: 'Team', value: 'team' },
        { text: 'Fee', value: 'fee', align: 'right' }
      ]
    }),
    computed: {
      ...mapGetters('teams', {
        getTeam: 'get'
      }),
      team () {
        return this.getTeam(this.$route.params.teamId)
      },
      seasonStart () {
        let date = parseISO(this.team.startedOn)
        date = addYears(date, parseInt(this.season))
        return format(date, 'yyyy-MM-dd')
      },
      seasonEnd () {
        let date = parseISO(this.team.startedOn)
        date = addYears(date, parseInt(this.season) + 1)
        return format(date, 'yyyy-MM-dd')
      },
      transfers () {
        const playerIds = this.$store.$db().model('Player')
          .query()
          .where('teamId', this.team.id)
          .get()
          .map(player => player.id)

        return this.$store.$db().model('Transfer')
          .query()
          .with('player.histories')
          .where('playerId', id => playerIds.indexOf(id) > -1)
          .where('movedOn', date => {
            return this.seasonStart <= date && date < this.seasonEnd
          })
          .get()
      },
      rows () {
        return this.transfers.map(transfer => ({
          ...transfer,
          name: transfer.player.name,
          dir: transfer.origin === this.team.name ? 'out' : 'in',
          team: transfer.origin === this.team.name
            ? transfer.destination
            : transfer.origin
        }))
      }
    },
    methods: {
      playerLink (transfer) {
        return {
          name: 'teams-teamId-players-playerId',
          params: {
            teamId: this.team.id,
            playerId: transfer.playerId
          }
        }
      }
    }
  }
</script>
