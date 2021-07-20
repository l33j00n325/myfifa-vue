<template>
  <v-dialog
    v-model="dialog"
    :persistent="loading"
    max-width="500px"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          icon="mdi-delete"
          dark
          :label="`Remove ${label}`"
          :on="on"
        />
      </slot>
    </template>
    <v-card>
      <v-card-title>
        <v-toolbar-title>
          <v-icon left>mdi-alert</v-icon>
          Confirm Action
        </v-toolbar-title>
      </v-card-title>
      <v-card-text class="pt-4 pb-0">
        Remove {{ label }}?
      </v-card-text>
      <v-alert
        v-model="error"
        type="error"
        dismissible
        tile
      >
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="loading"
          @click="dialog = false"
        >
          No
        </v-btn>
        <v-btn
          text
          color="red"
          :loading="loading"
          @click="remove"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import TooltipButton from './TooltipButton'

  export default {
    name: 'RecordRemove',
    components: {
      TooltipButton
    },
    props: {
      record: { type: Object, required: true },
      store: { type: String, required: true },
      redirect: { type: [String, Object], default: null },
      label: { type: String, default: null }
    },
    data: () => ({
      dialog: false,
      loading: false,
      error: false,
      errorMessage: ''
    }),
    methods: {
      async remove () {
        try {
          this.loading = true

          await Promise.all([
            this.$store.dispatch(`${this.store}/remove`, this.record.id),
            () => { this.redirect && this.$router.push(this.redirect) }
          ])

          this.dialog = false
        } catch (e) {
          this.errorMessage = e.message
          this.error = true
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
