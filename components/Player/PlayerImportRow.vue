<template>
  <tr>
    <td class="stick-left pa-1">
      <v-btn
        v-if="saved"
        text
        @click="$emit('remove', player)"
      >
        <v-icon color="success">mdi-check-circle</v-icon>
      </v-btn>
      <v-tooltip
        v-else-if="error.length > 0"
        color="red"
        right
      >
        <template #activator="{ on }">
          <v-btn
            text
            v-on="on"
            @click="error = ''"
          >
            <v-icon color="red">mdi-alert</v-icon>
          </v-btn>
        </template>
        <v-icon
          left
          dark
          v-text="'mdi-alert'"
        />
        {{ error }}
      </v-tooltip>
      <v-btn
        v-else
        text
        :loading="loading"
        @click="$emit('remove', player)"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </td>
    <td>
      <v-text-field
        v-model="player.name"
        label="Name"
        :rules="[isRequired]"
        dense
        outlined
        hide-details
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
    </td>
    <td>
      <nationality-field
        v-model="player.nationality"
        :icon="null"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-select
        v-model="player.pos"
        label="Position"
        :items="positions"
        :rules="[isRequired]"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-select
        v-model="player.secPos"
        label="2nd Position(s)"
        :items="positions"
        multiple
        chips
        small-chips
        deletable-chips
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-model.number="player.age"
        label="Age"
        :rules="[isRequired, isNumber]"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-text-field
        v-model.number="player.ovr"
        label="OVR"
        :rules="[isRequired, isNumber, inRange(null, [40, 100])]"
        dense
        outlined
        hide-details
        input="numeric"
      />
    </td>
    <td>
      <v-money-field
        v-model.number="player.value"
        label="Value"
        :prefix="team.currency"
        required
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-model.number="player.kitNo"
        label="Kit Number"
        :rules="[isNumber, inRange(null, [1, 99])]"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-date-field
        v-model="contract.endedOn"
        label="Contract Ends"
        :min="contract.startedOn"
        :max="maxEndDate"
        required
        dense
        outlined
        hide-details
        start-with-year
      />
    </td>
    <td>
      <v-money-field
        v-model.number="contract.wage"
        label="Wage"
        :prefix="team.currency"
        required
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-money-field
        v-model.number="contract.signingBonus"
        label="Signing Bonus"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-money-field
        v-model.number="contract.releaseClause"
        label="Release Clause"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-money-field
        v-model.number="contract.performanceBonus"
        label="Perf. Bonus"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-if="contract.performanceBonus"
        v-model.number="contract.bonusReq"
        label="Bonus Req."
        prefix="if"
        :rules="[isRequired, isNumber]"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-select
        v-if="contract.performanceBonus"
        v-model="contract.bonusReqType"
        label="Bonus Req. Type"
        :items="bonusRequirementTypes"
        :rules="[isRequired]"
        dense
        outlined
        hide-details
      />
    </td>
  </tr>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import { positions } from '@/constants'
  import { isRequired, isNumber, inRange } from '@/functions'

  export default {
    name: 'PlayerImportRow',
    props: {
      player: { type: Object, required: true },
      submitted: { type: Number, default: 0 },
      cleared: { type: Number, default: 0 }
    },
    data: () => ({
      loading: false,
      saved: false,
      error: '',
      isRequired: isRequired(),
      isNumber: isNumber(),
      inRange,
      positions,
      bonusRequirementTypes: [
        'Appearances',
        'Goals',
        'Assists',
        'Clean Sheets'
      ]
    }),
    computed: {
      ...mapGetters('teams', {
        getTeam: 'get'
      }),
      team () {
        return this.getTeam(this.$route.params.teamId)
      },
      contract () {
        return this.player.contractsAttributes[0]
      },
      maxEndDate () {
        return this.contract.startedOn && format(
          addYears(parseISO(this.contract.startedOn), 6),
          'yyyy-MM-dd'
        )
      }
    },
    watch: {
      submitted () {
        if (!this.loading && !this.saved) {
          this.savePlayer()
        }
      },
      cleared () {
        if (this.saved) {
          this.$emit('remove', this.player)
        }
      }
    },
    methods: {
      ...mapActions('players', {
        createPlayer: 'create'
      }),
      async savePlayer () {
        try {
          this.loading = true

          const attributes = { ...this.player }
          delete attributes.rowId
          await this.createPlayer({ teamId: this.team.id, attributes })
          this.saved = true
        } catch (e) {
          this.error = e.message
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style scoped>
  td:not(:first-child) {
    padding: 4px;
  }
  td >>> .v-input {
    width: 150px
  }
</style>
