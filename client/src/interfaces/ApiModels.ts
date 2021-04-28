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
  timer: number
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
  total_score: number
  type_id: number
}

export interface QuestionAlternative {
  id: number
  text: string
  value: number
  question_id: number
}

export interface QuestionAnswer {
  id: number
  question_id: number
  team_id: number
  answer: string
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

export interface QuestionAlternativeComponent extends Component {
  question_id: number
}
