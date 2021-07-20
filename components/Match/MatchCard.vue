<template>
  <v-card>
    <v-toolbar
      :color="color"
      dark
      dense
    >
      <v-toolbar-title class="font-weight-light">{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="match"
        :to="match.link"
        dark
        nuxt
        text
      >
        View Match
      </v-btn>
    </v-toolbar>
    <template v-if="match">
      <v-card-text class="text-center">
        <p class="font-weight-thin mb-0">
          {{ match.competition }}
        </p>
        <h4 class="text-h6 font-weight-light mt-0 mb-3">
          {{ match.home }} v {{ match.away }}
        </h4>
        <h4 class="text-h6 font-weight-light mb-0">
          {{ match.score }}
        </h4>
        <p class="font-weight-thin mt-0">
          {{ match.playedOn | formatDate }}
        </p>
      </v-card-text>
    </template>
    <div
      v-else
      class="text-center pa-4"
    >
      <p class="category font-weight-thin ma-0">
        No Matches have been Recorded.
      </p>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'MatchCard',
    props: {
      match: { type: Object, default: null },
      title: { type: String, default: null },
      color: { type: String, default: 'info' }
    }
  }
</script>
