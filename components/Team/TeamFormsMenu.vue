<template>
  <v-menu
    :close-on-content-click="false"
    offset-y
    offset-overflow
    bottom
  >
    <template #activator="{ on }">
      <v-btn v-on="on">
        <span>Create</span>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <player-form>
        <template #default="{ on }">
          <v-list-item v-on="on">
            <v-list-item-avatar>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>New Player</v-list-item-content>
          </v-list-item>
        </template>
      </player-form>
      <match-form>
        <template #default="{ on }">
          <v-list-item v-on="on">
            <v-list-item-avatar>
              <v-icon>mdi-soccer-field</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>New Match</v-list-item-content>
          </v-list-item>
        </template>
      </match-form>
      <squad-form>
        <template #default="{ on }">
          <v-list-item v-on="on">
            <v-list-item-avatar>
              <v-icon>mdi-clipboard-plus</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>New Squad</v-list-item-content>
          </v-list-item>
        </template>
      </squad-form>
      <competition-form>
        <template #default="{ on }">
          <v-list-item v-on="on">
            <v-list-item-avatar>
              <v-icon>mdi-trophy</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>New Competition</v-list-item-content>
          </v-list-item>
        </template>
      </competition-form>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'TeamFormsMenu'
  }
</script>
