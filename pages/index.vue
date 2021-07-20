<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <login-form v-if="!authenticated" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'AppPage',
    computed: mapGetters([
      'authenticated'
    ]),
    mounted () {
      this.setTitle('')
    },
    methods: mapMutations('app', {
      setTitle: 'setTitle'
    })
  }
</script>
