<template>
  <v-select
    :items="players"
    :item-value="itemValue"
    item-text="name"
    menu-props="auto"
    :label="label"
    :prepend-icon="icon"
    :disabled="disabled"
    :clearable="clearable"
    :hide-details="hideDetails"
    :rules="rules"
    :value="value"
    @change="updateValue"
  >
    <template #item="{ item }">
      <v-list-item-action>
        <v-list-item-action-text>{{ item.pos }}</v-list-item-action-text>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item-content>
    </template>
  </v-select>
</template>

<script>
  import { isRequired } from '@/functions'

  export default {
    name: 'PlayerSelect',
    props: {
      value: { type: [String, Number], default: null },
      players: { type: Array, default: () => [] },
      label: { type: String, default: 'Player' },
      icon: { type: String, default: 'mdi-account' },
      itemValue: { type: String, default: 'playerId' },
      required: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      clearable: { type: Boolean, default: false },
      hideDetails: { type: Boolean, default: false }
    },
    computed: {
      rules () {
        return this.required ? [isRequired(this.label)] : []
      }
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value || null)
      }
    }
  }
</script>
