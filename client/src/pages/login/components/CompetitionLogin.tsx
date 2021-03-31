import { Button, TextField } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { CompetitionLoginModel } from '../../../interfaces/models'
import { LoginForm } from './styled'

interface CompetitionLoginFormModel {
  model: CompetitionLoginModel
  error?: string
}

interface ServerResponse {
  code: number
  message: string
}

const competitionSchema: Yup.SchemaOf<CompetitionLoginFormModel> = Yup.object({
  model: Yup.object()
    .shape({
      code: Yup.string().required('Mata in kod').min(6, 'Koden måste vara minst 6 tecken'),
    })
    .required(),
  error: Yup.string().optional(),
})

const handleCompetitionSubmit = async (
  values: CompetitionLoginFormModel,
  actions: FormikHelpers<CompetitionLoginFormModel>
) => {
  console.log(values.model)
  await axios
    .post<ServerResponse>(`users/login`, { code: values.model.code })
    .then(() => {
      actions.resetForm()
    })
    .catch(({ response }) => {
      console.log(response.data.message)
      actions.setFieldError('error', response.data.message)
    })
    .finally(() => {
      actions.setSubmitting(false)
    })
}

const CompetitionLogin: React.FC = () => {
  const competitionInitialValues: CompetitionLoginFormModel = {
    model: { code: '' },
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
          {formik.errors.error ? (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {formik.errors.error}
            </Alert>
          ) : (
            <div />
          )}
        </LoginForm>
      )}
    </Formik>
  )
}

export default CompetitionLogin
