import { Component, Media, QuestionAlternative, QuestionAlternativeAnswer, QuestionScore } from './ApiModels'

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
  timer: number | null
  title: string
  competition_id: number
  background_image?: Media
  components: Component[]
  questions: RichQuestion[]
}

export interface RichTeam {
  id: number
  name: string
  question_alternative_answers: QuestionAlternativeAnswer[]
  question_scores: QuestionScore[]
  competition_id: number
}

export interface RichQuestion {
  id: number
  slide_id: number
  name: string
  title: string
  total_score: number
  type_id: number
  correcting_instructions: string
  alternatives: QuestionAlternative[]
}
