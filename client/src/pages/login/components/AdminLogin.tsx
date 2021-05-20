/** Component that handles the log in when a user is an admin */

import { Button, TextField, Typography } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { loginUser } from '../../../actions/user'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { AccountLoginModel } from '../../../interfaces/FormModels'
import { CenteredCircularProgress, LoginForm } from './styled'

interface AccountLoginFormModel {
  model: AccountLoginModel
  error?: string
}

interface formError {
  message: string
}

/** Form logic with some requirements and constraints */
const accountSchema: Yup.SchemaOf<AccountLoginFormModel> = Yup.object({
  model: Yup.object()
    .shape({
      email: Yup.string().email('Email inte giltig').required('Email krävs'),
      password: Yup.string().required('Lösenord krävs').min(6, 'Lösenord måste vara minst 6 tecken'),
    })
    .required(),
  error: Yup.string().optional(),
})

const AdminLogin: React.FC = () => {
  const [errors, setErrors] = useState({} as formError)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const UIErrors = useAppSelector((state) => state.UI.errors)
  const UILoading = useAppSelector((state) => state.UI.loading)
  useEffect(() => {
    if (UIErrors) {
      setErrors(UIErrors)
    }
    setLoading(UILoading)
  }, [UIErrors, UILoading])

  /** dispatch with the entered values */
  const handleAccountSubmit = (values: AccountLoginFormModel, actions: FormikHelpers<AccountLoginFormModel>) => {
    dispatch(loginUser(values.model, history))
  }

  const history = useHistory()
  const accountInitialValues: AccountLoginFormModel = {
    model: { email: '', password: '' },
  }

  /** Render the form */
  return (
    <Formik initialValues={accountInitialValues} validationSchema={accountSchema} onSubmit={handleAccountSubmit}>
      {(formik) => (
        <LoginForm onSubmit={formik.handleSubmit}>
          <TextField
            label="Email Adress"
            name="model.email"
            data-testid="email"
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
            data-testid="password"
            helperText={formik.touched.model?.password ? formik.errors.model?.password : ''}
            error={Boolean(formik.touched.model?.password && formik.errors.model?.password)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
          />
          <Button
            type="submit"
            data-testid="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={!!formik.errors.model?.password || !!formik.errors.model?.email || loading}
          >
            Logga in
          </Button>
          {errors.message && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <Typography>Någonting gick fel. Kontrollera</Typography>
              <Typography>dina användaruppgifter och försök igen</Typography>
            </Alert>
          )}
          {loading && <CenteredCircularProgress color="secondary" />}
        </LoginForm>
      )}
    </Formik>
  )
}
export default AdminLogin
