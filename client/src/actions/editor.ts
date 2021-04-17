import axios from 'axios'
import { AppDispatch } from './../store'
import Types from './types'

export const getEditorCompetition = (id: string) => async (dispatch: AppDispatch) => {
  await axios
    .get(`/competitions/${id}`)
    .then((res) => {
      dispatch({
        type: Types.SET_EDITOR_COMPETITION,
        //res.data,
        payload: {
          name: 'Tävling 1 (Hårdkodad)',
          id: 1,
          year: 1337,
          city_id: 1,
          slides: [
            {
              competition_id: 1,
              id: 1,
              order: 1,
              timer: 10,
              title: 'Sida 1',
              questions: [
                {
                  id: 1,
                  slide_id: 1,
                  name: 'Fråga 1 namn',
                  title: 'Fråga 1 titel',
                  total_score: 5,
                  type_id: 3,
                  question_answers: [
                    {
                      id: 1,
                      question_id: 1,
                      team_id: 1,
                      data: 'question answer data 1',
                      score: 1,
                    },
                    {
                      id: 2,
                      question_id: 1,
                      team_id: 2,
                      data: 'question answer data 2',
                      score: 3,
                    },
                  ],
                  alternatives: [
                    {
                      id: 1,
                      text: '1',
                      value: true,
                      question_id: 1,
                    },
                    {
                      id: 2,
                      text: '0',
                      value: false,
                      question_id: 1,
                    },
                  ],
                },
              ],
              body: 'Slide body 1',
              settings: 'Slide settings 1',
            },

            {
              competition_id: 1,
              id: 2,
              order: 2,
              timer: 15,
              title: 'Sida 2',
              questions: [
                {
                  id: 2,
                  slide_id: 2,
                  name: 'Fråga 2 namn',
                  title: 'Fråga 2 titel',
                  total_score: 6,
                  type_id: 3,
                  question_answers: [
                    {
                      id: 3,
                      question_id: 2,
                      team_id: 1,
                      data: 'question answer data 1',
                      score: 1,
                    },
                    {
                      id: 4,
                      question_id: 2,
                      team_id: 2,
                      data: 'question answer data 2',
                      score: 4,
                    },
                  ],
                  alternatives: [
                    {
                      id: 1,
                      text: '5',
                      value: true,
                      question_id: 2,
                    },
                    {
                      id: 2,
                      text: 'abc',
                      value: false,
                      question_id: 2,
                    },
                  ],
                },
              ],
              body: 'Slide body 2',
              settings: 'Slide settings 2',
            },
          ],

          teams: [
            {
              id: 1,
              name: 'Örkelljunga IK',
              question_answers: [
                {
                  id: 1,
                  question_id: 1,
                  team_id: 1,
                  data: 'question answer data 1',
                  score: 1,
                },
                {
                  id: 3,
                  question_id: 2,
                  team_id: 1,
                  data: 'question answer data 1',
                  score: 1,
                },
              ],
              competition_id: 1,
            },
            {
              id: 2,
              name: 'Vadstena OK',
              question_answers: [
                {
                  id: 2,
                  question_id: 1,
                  team_id: 2,
                  data: 'question answer data 2',
                  score: 3,
                },
                {
                  id: 4,
                  question_id: 2,
                  team_id: 2,
                  data: 'question answer data 2',
                  score: 4,
                },
              ],
              competition_id: 1,
            },
          ],
        },
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
