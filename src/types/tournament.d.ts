type TeamForm = 'W' | 'D' | 'L'

type Team = {
  id: string
  name: string
  logo: string
  games: number
  wins: number
  draws: number
  loses: number
  scored: number
  conceded: number
  points: number
  form: TeamForm[]
  group: string
}
