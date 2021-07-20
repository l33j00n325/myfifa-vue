<template>
  <v-sheet
    color="transparent"
    width="100%"
    class="d-flex align-center"
  >
    <span class="mr-2">
      <v-img
        v-if="team.badgePath"
        :src="badgeUrl"
        height="32px"
        width="32px"
        contain
      />
      <v-tooltip
        v-else
        bottom
      >
        <template #activator="{ on }">
          <v-icon
            large
            v-on="on"
            v-text="'mdi-shield-off-outline'"
          />
        </template>
        <span>Edit Team to upload Badge</span>
      </v-tooltip>
    </span>
    <v-toolbar-title>
      <div
        class="text-overline"
        :style="{ lineHeight: '1rem' }"
        v-text="team.name"
      />
      <div class="text-h6 font-weight-thin">
        {{ headline }}
        <small v-show="caption">{{ caption }}</small>
      </div>
    </v-toolbar-title>
    <v-spacer />
    <team-date-picker />
  </v-sheet>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'TeamBarExtension',
    props: {
      team: { type: Object, required: true }
    },
    computed: {
      ...mapState('app', [
        'headline',
        'caption'
      ]),
      badgeUrl () {
        const { browserBaseURL } = this.$config.axios
        return this.team.badgePath &&
          `${browserBaseURL.replace(/\/api/, '')}${this.team.badgePath}`
      }
    }
  }
</script>
