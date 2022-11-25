import { SportEvent } from "./sportEvent"
import { SportScore } from "./sportScore"

export type Sport = {
    sportId: number
    name: string
    events: SportEvent[]
    scores: SportScore[]
  }
  