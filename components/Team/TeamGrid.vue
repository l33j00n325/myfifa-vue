<template>
  <v-card>
    <v-card-text>
      <client-only>
        <v-data-table
          :headers="headers"
          :items="teams"
          item-key="id"
          sort-by="id"
          sort-desc
          no-data-text="No Teams Recorded"
        >
          <template #item.name="{ item }">
            <v-btn
              :to="`/teams/${item.id}`"
              nuxt
              text
              color="primary"
              v-text="item.name"
            />
          </template>
          <template #item.badgePath="{ item }">
            <v-img
              v-if="item.badgePath"
              :src="badgeUrl(item)"
              height="32px"
              width="32px"
              contain
              class="text-center"
            />
          </template>
          <template #item.startedOn="{ item }">
            {{ item.startedOn | formatDate }}
          </template>
          <template #item.currentlyOn="{ item }">
            {{ item.currentlyOn | formatDate }}
          </template>
        </v-data-table>
      </client-only>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'TeamGrid',
    data: () => ({
      headers: [
        { text: 'Name', value: 'name', align: 'center' },
        { text: 'Badge', value: 'badgePath', align: 'center', width: '32px', sortable: false },
        { text: 'Start Date', value: 'startedOn', align: 'center' },
        { text: 'Current Date', value: 'currentlyOn', align: 'center' }
      ],
      search: ''
    }),
    computed: mapGetters('teams', {
      teams: 'list'
    }),
    methods: {
      badgeUrl (team) {
        const { browserBaseURL } = this.$config.axios
        return team.badgePath
          ? `${browserBaseURL.replace(/\/api/, '')}${team.badgePath}`
          : null
      }
    }
  }
</script>
