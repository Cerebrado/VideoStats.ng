import { Player } from "./player"
import { Sport } from "./sport"
import { SportEvent } from "./sportEvent"

export type Match = {
    matchId: number, 
    sportId: number
    sport?: Sport,
    active: boolean,
    players: Player[],
    events: SportEvent[]
    name: string
    videoPath: string
    year: number,
    month: number,
    day: number,
    hour: number,
    minutes: number,
    user_id: string,
  }
  