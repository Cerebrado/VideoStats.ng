import { Player } from "./player"
import { Sport } from "./sport"

export type Match = {
    matchId: number, 
    sport: Sport,
    active: boolean,
    players: Player[],
    name: string
    videoPath: string
    year: number,
    month: number,
    day: number,
    hour: number,
    minutes: number,
    user_id: string,
  }
  