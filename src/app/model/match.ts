import { Place } from "./place"
import { Player } from "./player"
import { Sport } from "./sport"
import { SportEvent } from "./sportEvent"

export type Match = {
    sportId: number
    sport?: Sport,
    placeId: number
    place?: Place,
    date: string,
    user_id: string,
    active: boolean,
    players: Player[],
    events: SportEvent[]
  }
  