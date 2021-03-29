import { Button, TextField } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { AccountLoginModel } from '../../../interfaces/models'
import { LoginForm } from './styled'

interface AccountLoginFormModel {
  model: AccountLoginModel
  error?: string
}

interface ServerResponse {
  code: number
  message: string
}

const accountSchema: Yup.SchemaOf<AccountLoginFormModel> = Yup.object({
  model: Yup.object()
    .shape({
      email: Yup.string().email('Email inte giltig').required('Email krävs'),
      password: Yup.string().required('Lösenord krävs').min(6, 'Lösenord måste vara minst 6 tecken'),
    })
    .required(),
  error: Yup.string().optional(),
})

const handleAccountSubmit = async (values: AccountLoginFormModel, actions: FormikHelpers<AccountLoginFormModel>) => {
  await axios
    .post<ServerResponse>(`users/login`, values.model)
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

const AdminLogin: React.FC = () => {
  const accountInitialValues: AccountLoginFormModel = {
    model: { email: '', password: '' },
  }
  return (
    <Formik initialValues={accountInitialValues} validationSchema={accountSchema} onSubmit={handleAccountSubmit}>
      {(formik) => (
        <LoginForm onSubmit={formik.handleSubmit}>
          <TextField
            label="Email Adress"
            name="model.email"
            helperText={formik.touched.model?.email ? formik.errors.model?.email : ''}
            error={Boolean(formik.touched.model?.email && formik.errors.model?.email)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
          />
          <TextField
            label="Lösenord"
            name="model.password"
            type="password"
            helperText={formik.touched.model?.password ? formik.errors.model?.password : ''}
            error={Boolean(formik.touched.model?.password && formik.errors.model?.password)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!formik.isValid || !formik.touched.model?.email || !formik.touched.model?.email}
          >
            Logga in
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

export default AdminLogin
