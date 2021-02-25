import { Button, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'
import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { LoginModel } from '../interfaces/models'
import './Login.css'

const styles = {}

interface LoginState {
  status: number
  message: string
}

interface LoginFormModel {
  model: LoginModel
  error?: string
}

interface ServerResponse {
  code: number
  message: string
}

const schema: Yup.SchemaOf<LoginFormModel> = Yup.object({
  model: Yup.object()
    .shape({
      email: Yup.string()
        .email('Email not valid')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
    })
    .required(),
  error: Yup.string().optional()
})

const handleSubmit = async (
  values: LoginFormModel,
  actions: FormikHelpers<LoginFormModel>
) => {
  await axios
    .post<ServerResponse>(`users/login`, values.model)
    .then((res) => {
      actions.resetForm()
    })
    .catch(({ response }) => {
      actions.setFieldError('error', response.data.message)
    })
    .finally(() => {
      actions.setSubmitting(false)
    })
}

const LoginForm: React.FC = (props) => {
  const [serverState, setServerState] = useState<LoginFormModel>()
  const initialValues: LoginFormModel = { model: { email: '', password: '' } }
  return (
    <div className="login-page">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="login-form">
            <TextField
              label="Email Address"
              name="model.email"
              helperText={
                formik.touched.model?.email ? formik.errors.model?.email : ''
              }
              error={Boolean(formik.errors.model?.email)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
            />
            <TextField
              label="Password"
              name="model.password"
              type="password"
              helperText={
                formik.touched.model?.password
                  ? formik.errors.model?.password
                  : ''
              }
              error={Boolean(formik.errors.model?.password)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!formik.isValid}
            >
              Submit
            </Button>
            {formik.errors.error ? (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {formik.errors.error}
              </Alert>
            ) : (
              <div />
            )}
          </form>
        )}
      </Formik>
    </div>
  )
}

export default withStyles(styles)(LoginForm)
