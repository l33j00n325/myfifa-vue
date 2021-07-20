import { gql } from 'nuxt-graphql-request'

export const matchFragment = gql`
  fragment MatchData on Match {
    id
    teamId
    home
    away
    competition
    stage
    playedOn
    extraTime
    homeScore
    awayScore
    score
    teamResult
    season
  }
`

export const baseCapFragment = gql`
  fragment BaseCapData on Cap {
    id
    matchId
    playerId
    pos
    start
    stop
    subbedOut
  }
`

export const capFragment = gql`
  fragment CapData on Cap {
    ...BaseCapData
    player {
      id
      name
      pos
      value
      ovr
      histories {
        id
        playerId
        value
        ovr
      }
    }
  }
  ${baseCapFragment}
`

export const goalFragment = gql`
  fragment GoalData on Goal {
    id
    createdAt
    matchId
    playerId
    playerName
    assistId
    assistedBy
    minute
    penalty
    ownGoal
  }
`

export const substitutionFragment = gql`
  fragment SubstitutionData on Substitution {
    id
    createdAt
    matchId
    playerId
    playerName
    replacementId
    replacedBy
    minute
    injury
  }
`

export const bookingFragment = gql`
  fragment BookingData on Booking {
    id
    createdAt
    matchId
    playerId
    playerName
    minute
    redCard
  }
`

export const penaltyShootoutFragment = gql`
  fragment PenaltyShootoutData on PenaltyShootout {
    id
    matchId
    homeScore
    awayScore
  }
`
