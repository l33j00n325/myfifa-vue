import { gql } from 'nuxt-graphql-request'

export const competitionStatsFragment = gql`
  fragment CompetitionStatsData on CompetitionStats {
    season
    competition
    wins
    draws
    losses
    goalsFor
    goalsAgainst
  }
`

export const playerPerformanceStatsFragment = gql`
  fragment PlayerPerformanceStatsData on PlayerPerformanceStats {
    playerId
    season
    competition
    numMatches
    numMinutes
    numGoals
    numAssists
    numCleanSheets
  }
`

export const playerDevelopmentStatsFragment = gql`
  fragment PlayerDevelopmentStatsData on PlayerDevelopmentStats {
    season
    playerId
    ovr
    value
  }
`
