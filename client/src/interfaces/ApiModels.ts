export interface NameID {
  id: number
  name: string
}
export interface City extends NameID {}

export interface Role extends NameID {}

export interface QuestionType extends NameID {}
export interface ComponentType extends NameID {}
export interface ViewType extends NameID {}

export interface AllTypes {
  media_types: MediaType[]
  question_types: QuestionType[]
  component_types: ComponentType[]
  view_types: ViewType[]
}

export interface Media {
  id: number
  filename: string
  mediatype_id: number
  user_id: number
}

export interface MediaType extends NameID {}

export interface User extends NameID {
  email: string
  role_id: number
  city_id: number
}

export interface Slide {
  competition_id: number
  id: number
  order: number
  timer: number | null
  title: string
  background_image?: Media
}

export interface Competition extends NameID {
  font: string
  city_id: number
  year: number
  background_image?: Media
}

export interface Team extends NameID {
  competition_id: number
}

export interface Question extends NameID {
  slide_id: number
  total_score: number | null
  type_id: number
  correcting_instructions: string
}

export interface QuestionAlternative {
  id: number
  alternative: string
  alternative_order: number
  correct: string
  correct_order: number
  question_id: number
}

export interface QuestionAlternativeAnswer {
  id: number
  team_id: number
  question_alternative_id: number
  answer: string
}

export interface QuestionScore {
  id: number
  team_id: number
  question_id: number
  score: number
}

export interface Component {
  id: number
  x: number
  y: number
  w: number
  h: number
  type_id: number
  view_type_id: number
  slide_id: number
}

export interface ImageComponent extends Component {
  media: Media
}

export interface TextComponent extends Component {
  text: string
  font: string
}

export interface QuestionComponent extends Component {
  id: number
  x: number
  y: number
  w: number
  h: number
  slide_id: number
  type_id: number
  view_type_id: number
  text: string
  media: Media
  question_id: number
}
