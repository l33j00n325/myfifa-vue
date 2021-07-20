<template>
  <v-card flat>
    <v-card-title>
      <inline-field
        :key="key"
        :item="round"
        attribute="name"
        label="Stage Name"
        :readonly="readonly"
        display-class="font-weight-light"
        @close="updateStageAttribute(round.id, 'name', $event)"
      />
      <v-spacer />
      <template v-if="!readonly">
        <fixture-form
          :stage="round"
          class="d-inline-block"
        />
        <record-remove
          :record="round"
          store="stages"
          :label="round.name"
        />
      </template>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="-1"
      :mobile-breakpoint="0"
      disable-sort
      hide-default-footer
    >
      <template #item.homeTeam="{ item }">
        <span :class="teamClass(item.homeTeam)">{{ item.homeTeam }}</span>
      </template>
      <template #item.score="{ item }">
        <div
          v-for="leg in item.legs"
          :key="leg.id"
        >
          {{ leg.score }}
        </div>
      </template>
      <template #item.awayTeam="{ item }">
        <span :class="teamClass(item.awayTeam)">{{ item.awayTeam }}</span>
      </template>
      <template #item.edit="{ item }">
        <fixture-form
          :stage="round"
          :record="item"
          class="d-inline-block"
        >
          <template #default="{ on }">
            <tooltip-button
              label="Edit Fixture"
              icon="mdi-pencil"
              color="orange"
              :on="on"
            />
          </template>
        </fixture-form>
      </template>
      <template #item.delete="{ item }">
        <record-remove
          :record="item"
          store="fixtures"
          label="Fixture"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'

  export default {
    name: 'RoundStage',
    mixins: [
      CompetitionAccessible
    ],
    props: {
      round: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    data: () => ({
      key: 0
    }),
    computed: {
      items () {
        return Object.values(this.round.fixtures) || []
      },
      headers () {
        const headers = [
          { text: 'Home Team', value: 'homeTeam', align: 'right' },
          { text: 'Score', value: 'score', align: 'center' },
          { text: 'Away Team', value: 'awayTeam' }
        ]

        if (!this.readonly) {
          headers.push({
            text: '',
            value: 'edit',
            width: 40
          })
          headers.push({
            text: '',
            value: 'delete',
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
            attributes: { [attribute]: value }
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
