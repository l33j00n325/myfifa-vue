import { gql } from 'nuxt-graphql-request'

export const baseSquadFragment = gql`
  fragment BaseSquadData on Squad {
    id
    teamId
    name
  }
`

export const baseSquadPlayerFragment = gql`
  fragment BaseSquadPlayerData on SquadPlayer {
    id
    squadId
    playerId
    pos
  }
`

export const squadPlayerFragment = gql`
  fragment SquadPlayerData on SquadPlayer {
    ...BaseSquadPlayerData
    player {
      id
      teamId
      name
      pos
    }
  }
  ${baseSquadPlayerFragment}
`

export const squadFragment = gql`
  fragment SquadData on Squad {
    ...BaseSquadData
    squadPlayers { ...SquadPlayerData }
  }
  ${baseSquadFragment}
  ${squadPlayerFragment}
`
