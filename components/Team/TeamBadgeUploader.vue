<template>
  <dialog-form
    :key="key"
    v-model="dialog"
    :title="`${team.badgePath ? 'Change' : 'Upload'} Badge`"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>
    <template #form>
      <v-col
        v-if="team.badgePath"
        cols="12"
      >
        <v-subheader>Current Badge</v-subheader>
        <v-img
          :src="badgeUrl"
          height="100px"
          contain
          class="text-center"
        />
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-model="badge"
          label="Badge"
          :rules="rulesForBadge"
          prepend-icon="mdi-shield-plus"
          accept="image/*"
        />
      </v-col>
    </template>
    <template #additional-actions>
      <v-btn
        v-if="team.badgePath"
        color="red"
        text
        dark
        @click="removeBadge"
        v-text="'Remove'"
      />
    </template>
  </dialog-form>
</template>

<script>
  import { DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'TeamBadgeUploader',
    mixins: [
      DialogFormable
    ],
    props: {
      team: { type: Object, required: true }
    },
    data: () => ({
      key: 0,
      loading: false,
      badge: null,
      rulesForBadge: [isRequired('Badge')]
    }),
    computed: {
      badgeUrl () {
        const { browserBaseURL } = this.$config.axios
        return this.team.badgePath
          ? `${browserBaseURL.replace(/\/api/, '')}${this.team.badgePath}`
          : null
      }
    },
    methods: {
      async submit () {
        const formData = new FormData()
        formData.append('team[badge]', this.badge)
        const badgePath = await this.$axios.$post(
          `teams/${this.team.id}/badge`,
          formData
        )
        this.$store.$db().model('Team').update({
          id: this.team.id,
          badgePath
        })
      },
      async removeBadge () {
        try {
          this.loading = true
          await this.$axios.$delete(`teams/${this.team.id}/badge`)
          this.$store.$db().model('Team').update({
            id: this.team.id,
            badgePath: null
          })
          this.key++
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
