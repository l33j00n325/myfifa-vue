import { gql } from 'nuxt-graphql-request'

export const competitionFragment = gql`
  fragment CompetitionData on Competition {
    id
    teamId
    season
    name
    champion
  }
`

export const fixtureLegFragment = gql`
  fragment FixtureLegData on FixtureLeg {
    id
    fixtureId
    homeScore
    awayScore
  }
`

export const fixtureFragment = gql`
  fragment FixtureData on Fixture {
    id
    stageId
    homeTeam
    awayTeam
    legs { ...FixtureLegData }
  }
  ${fixtureLegFragment}
`

export const tableRowFragment = gql`
  fragment TableRowData on TableRow {
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
`

export const baseStageFragment = gql`
  fragment BaseStageData on Stage {
    id
    competitionId
    name
    numTeams
    numFixtures
    table
  }
`

export const stageFragment = gql`
  fragment StageData on Stage {
    ...BaseStageData
    fixtures { ...FixtureData }
    tableRows { ...TableRowData }
  }
  ${baseStageFragment}
  ${fixtureFragment}
  ${tableRowFragment}
`
