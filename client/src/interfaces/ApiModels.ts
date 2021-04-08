interface NameID {
  id: number
  name: string
}
export interface City extends NameID {}
export interface Role extends NameID {}
export interface MediaType extends NameID {}
export interface QuestionType extends NameID {}

export interface Media {
  id: number
  filename: string
  mediatype_id: number
  user_id: number
}

export interface User extends NameID {
  email: string
  role_id: number
  city_id: number
}

export interface Competition extends NameID {
  city_id: number
  year: number
}

export interface Team extends NameID {
  competition_id: number
}

export interface Question extends NameID {
  slide_id: number
  title: string
  total_score: number
  type_id: number
}

export interface QuestionAlternative {
  id: number
  text: string
  value: boolean
  question_id: number
}
export interface QuestionAnswer {
  id: number
  question_id: number
  team_id: string
  data: string
  score: number
}

export interface Component {
  id: number
  x: number
  y: number
  w: number
  h: number
  type: number
}

export interface ImageComponent extends Component {
  media_id: number
}

export interface TextComponent extends Component {
  text: string
  font: string
}

export interface QuestionAlternativeComponent extends Component {
  question_alternative_id: number
  font: string
}
