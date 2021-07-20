<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <user-profile />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <user-password-changer />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'AccountPage',
    fetch () {
      this.setPage({
        title: 'Account',
        headline: 'Account'
      })
    },
    methods: mapMutations('app', [
      'setPage'
    ])
  }
</script>
