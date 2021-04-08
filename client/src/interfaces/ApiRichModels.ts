import { City, Component, Media, QuestionAnswer, QuestionType } from './ApiModels'

export interface RichCompetition {
  name: string
  id: number
  year: number
  city: City
  slides: RichSlide[]
  teams: RichTeam[]
}

export interface RichSlide {
  id: number
  order: number
  timer: number
  title: string
  competition_id: number
  question: RichQuestion[]
  components: Component[]
  medias: Media[]
}

export interface RichTeam {
  id: number
  name: string
  question_answers: QuestionAnswer[]
  competition_id: number
}

export interface RichQuestion {
  id: number
  slide_id: number
  name: string
  title: string
  total_score: number
  question_type: QuestionType
}
