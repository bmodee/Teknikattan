/** Handles the uploading of a picture to a competition */

import axios from 'axios'
import { getEditorCompetition } from '../actions/editor'
import { Media } from '../interfaces/ApiModels'
import store from '../store'

export const uploadFile = async (formData: FormData, competitionId: string) => {
  // Uploads the file to the server and creates a Media object in database.
  // Returns media object data.
  return await axios
    .post(`/api/media/images`, formData)
    .then((response) => {
      getEditorCompetition(competitionId)(store.dispatch, store.getState)
      return response.data as Media
    })
    .catch(console.log)
}
