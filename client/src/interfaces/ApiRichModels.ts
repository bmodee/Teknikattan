import { Component, Media, QuestionAlternative, QuestionAnswer, QuestionType } from './ApiModels'

export interface RichCompetition {
  name: string
  id: number
  year: number
  city_id: number
  slides: RichSlide[]
  teams: RichTeam[]
  background_image?: Media
}

export interface RichSlide {
  id: number
  order: number
  timer: number
  title: string
  competition_id: number
  background_image?: Media
  components: Component[]
  questions: RichQuestion[]
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
  type_id: number
  alternatives: QuestionAlternative[]
}
