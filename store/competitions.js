import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async fetch (_, { teamId }) {
    const query = gql`
      mutation fetchCompetitions($teamId: ID!) {
        team(id: $teamId) {
          competition {
            id
            teamId
            season
            name
            champion
          }
        }
      }
    `

    const { team: competitions } =
      await this.$graphql.default.request(query, { teamId })
    this.$db().model('Competition').insertOrUpdate({ data: competitions })
  },
  async get (_, id) {
    const query = gql`
      query fetchCompetition($id: ID!) {
        competition(id: $id) {
          id
          teamId
          season
          name
          champion
          stages {
            id
            competitionId
            name
            numTeams
            numFixtures
            table
            tableRows {
              id
              stageId
              name
              wins
              draws
              losses
              goalsFor
              goalsAgainst
              goalDifference
              points
            }
            fixtures {
              id
              stageId
              homeTeam
              awayTeam
              legs {
                id
                fixtureId
                homeScore
                awayScore
              }
            }
          }
        }
      }
    `

    const { competition } = await this.$graphql.default.request(query, { id })
    this.$db().model('Competition').insertOrUpdate({ data: competition })
  },
  async create (_, { teamId, attributes }) {
    const query = gql`
      mutation createCompetition($teamId: ID!, $attributes: CompetitionAttributes!) {
        addCompetition(teamId: $teamId, attributes: $attributes) {
          competition { id }
          errors { fullMessages }
        }
      }
    `

    const { addCompetition: { errors, competition } } =
      await this.$graphql.default.request(query, { teamId, attributes })

    if (competition) {
      this.$db().model('Competition').insert({ data: competition })
      return competition
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: CompetitionAttributes!) {
        updateCompetition(id: $id, attributes: $attributes) {
          competition { id }
          errors { fullMessages }
        }
      }
    `

    const { updateCompetition: { errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async remove (_, id) {
    const query = gql`
      mutation removeCompetition($id: ID!) {
        removeCompetition(id: $id) {
          errors { fullMessages }
        }
      }
    `

    const { removeCompetition: { errors } } =
      await this.$graphql.default.request(query, { id })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      this.$db().model('Competition').delete(id)
    }
  }
}
