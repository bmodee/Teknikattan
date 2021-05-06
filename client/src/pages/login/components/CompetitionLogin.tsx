/** Component that handles the log in when a user connects to a competition through a code */

import { Button, TextField, Typography } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { Formik } from 'formik'
import React from 'react'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { loginCompetition } from '../../../actions/competitionLogin'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { CompetitionLoginModel } from '../../../interfaces/FormModels'
import { CenteredCircularProgress, LoginForm } from './styled'

interface CompetitionLoginFormModel {
  model: CompetitionLoginModel
  error?: string
}

interface formError {
  message: string
}

const competitionSchema: Yup.SchemaOf<CompetitionLoginFormModel> = Yup.object({
  model: Yup.object()
    .shape({
      code: Yup.string().required('Mata in kod').length(6, 'Koden måste vara 6 tecken'),
    })
    .required(),
  error: Yup.string().optional(),
})

const CompetitionLogin: React.FC = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const errors = useAppSelector((state) => state.competitionLogin.errors)
  const loading = useAppSelector((state) => state.competitionLogin.loading)
  const competitionInitialValues: CompetitionLoginFormModel = {
    model: { code: '' },
  }
  const handleCompetitionSubmit = async (values: CompetitionLoginFormModel) => {
    dispatch(loginCompetition(values.model.code, history, true))
  }

  return (
    <Formik
      initialValues={competitionInitialValues}
      validationSchema={competitionSchema}
      onSubmit={handleCompetitionSubmit}
    >
      {(formik) => (
        <LoginForm onSubmit={formik.handleSubmit}>
          <TextField
            label="Tävlingskod"
            name="model.code"
            helperText={formik.touched.model?.code && formik.touched.model?.code ? formik.errors.model?.code : ''}
            error={Boolean(formik.touched.model?.code && formik.errors.model?.code)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
          />
          <Button type="submit" fullWidth variant="contained" color="secondary" disabled={!formik.isValid}>
            Anslut till tävling
          </Button>
          {errors && errors.message && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <Typography>En tävling med den koden hittades ej.</Typography>
              <Typography>kontrollera koden och försök igen</Typography>
            </Alert>
          )}
          {loading && <CenteredCircularProgress color="secondary" />}
        </LoginForm>
      )}
    </Formik>
  )
}

export default CompetitionLogin
