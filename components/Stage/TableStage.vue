<template>
  <v-card flat>
    <v-card-title>
      <inline-field
        :key="key"
        :item="table"
        attribute="name"
        label="Table Name"
        :readonly="readonly"
        display-class="font-weight-light"
        @close="updateStageAttribute(table.id, 'name', $event)"
      />
      <v-spacer />
      <template v-if="!readonly">
        <table-row-form
          :stage="table"
          class="d-inline-block"
        />
        <record-remove
          :record="table"
          store="stages"
          :label="table.name"
        />
      </template>
    </v-card-title>
    <v-data-table
      :key="key"
      :headers="headers"
      :items="items"
      :mobile-breakpoint="0"
      :sort-by="['points', 'goal_difference', 'goals_for', 'goals_against']"
      :sort-desc="[true, true, true, true]"
      multi-sort
      :items-per-page="-1"
      hide-default-footer
    >
      <template #item.name="{ item }">
        <span :class="teamClass(item.name)">{{ item.name }}</span>
      </template>
      <template #item.wins="{ item }">
        <span :class="teamClass(item.name)">{{ item.wins }}</span>
      </template>
      <template #item.draws="{ item }">
        <span :class="teamClass(item.name)">{{ item.draws }}</span>
      </template>
      <template #item.losses="{ item }">
        <span :class="teamClass(item.name)">{{ item.losses }}</span>
      </template>
      <template #item.goals_for="{ item }">
        <span :class="teamClass(item.name)">{{ item.goals_for }}</span>
      </template>
      <template #item.goals_against="{ item }">
        <span :class="teamClass(item.name)">{{ item.goals_against }}</span>
      </template>
      <template #item.goal_difference="{ item }">
        <span :class="teamClass(item.name)">{{ item.goal_difference }}</span>
      </template>
      <template #item.points="{ item }">
        <span :class="teamClass(item.name)">{{ item.points }}</span>
      </template>
      <template #item.edit="{ item }">
        <table-row-form
          :stage="table"
          :record="item"
          class="d-inline-block"
        >
          <template #default="{ on }">
            <tooltip-button
              label="Edit Table Row"
              icon="mdi-pencil"
              color="orange"
              :on="on"
              small
            />
          </template>
        </table-row-form>
      </template>
      <template #item.delete="{ item }">
        <record-remove
          :record="item"
          store="tableRows"
          label="Table Row"
          small
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'

  export default {
    name: 'TableStage',
    mixins: [
      CompetitionAccessible
    ],
    props: {
      table: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    data: () => ({
      key: 0
    }),
    computed: {
      items () {
        return Object.values(this.table.table_rows || {})
      },
      headers () {
        const headers = [
          { text: 'Team', value: 'name', sortable: false },
          { text: 'W', value: 'wins', align: 'center' },
          { text: 'D', value: 'draws', align: 'center' },
          { text: 'L', value: 'losses', align: 'center' },
          { text: 'GF', value: 'goals_for', align: 'center' },
          { text: 'GA', value: 'goals_against', align: 'center' },
          { text: 'GD', value: 'goal_difference', align: 'center' },
          { text: 'PTS', value: 'points', align: 'center' }
        ]

        if (!this.readonly) {
          headers.push({
            text: '',
            value: 'edit',
            sortable: false,
            width: 40
          })
          headers.push({
            text: '',
            value: 'delete',
            sortable: false,
            width: 40
          })
        }

        return headers
      }
    },
    methods: {
      ...mapMutations('broadcaster', [
        'announce'
      ]),
      ...mapActions('stages', {
        updateStage: 'update'
      }),
      async updateStageAttribute (stageId, attribute, value) {
        try {
          await this.updateStage({
            id: stageId,
            [attribute]: value
          })
        } catch (e) {
          this.key++
          this.announce({
            message: e.message,
            color: 'red'
          })
        }
      }
    }
  }
</script>
