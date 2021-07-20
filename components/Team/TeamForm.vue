<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-shield-half-full"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.startedOn"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :disabled="!!record"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.currency"
          label="Currency"
          prepend-icon="mdi-cash"
          :rules="rulesFor.currency"
        />
      </v-col>
    </template>
    <template #additional-actions>
      <team-badge-uploader
        v-if="record"
        :team="record"
        color="info"
      >
        <template #default="{ on }">
          <v-btn
            color="info"
            text
            v-on="on"
            v-text="`${record.badgePath ? 'Change' : 'Upload'} Badge`"
          />
        </template>
      </team-badge-uploader>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { format } from 'date-fns'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'TeamForm',
    mixins: [
      DialogFormable
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      attributes: {
        name: '',
        startedOn: format(new Date(), 'yyyy-MM-dd'),
        currency: '$'
      },
      rulesFor: {
        name: [isRequired('Name')],
        currency: [isRequired('Currency')]
      }
    }),
    computed: {
      title () {
        return this.record ? 'Edit Team' : 'New Team'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes = pick(this.record, [
            'name',
            'startedOn',
            'currency'
          ])
        }
      }
    },
    methods: {
      ...mapActions('teams', {
        createTeam: 'create',
        updateTeam: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateTeam({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          const { id: teamId } = await this.createTeam(this.attributes)
          this.$router.push({
            name: 'teams-teamId',
            params: { teamId }
          })
        }
      }
    }
  }
</script>
