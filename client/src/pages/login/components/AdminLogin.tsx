import { Button, TextField } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { loginUser } from '../../../actions/user'
import { AccountLoginModel } from '../../../interfaces/models'
import { CenteredCircularProgress, LoginForm } from './styled'

interface AccountLoginFormModel {
  model: AccountLoginModel
  error?: string
}

interface ServerResponse {
  code: number
  message: string
}

interface formError {
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

const AdminLogin: React.FC = (props: any) => {
  const [errors, setErrors] = useState({} as formError)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (props.UI.errors) {
      setErrors(props.UI.errors)
    }
    setLoading(props.UI.loading)
  }, [props.UI])
  const handleAccountSubmit = (values: AccountLoginFormModel, actions: FormikHelpers<AccountLoginFormModel>) => {
    props.loginUser(values.model, history)
  }

  const history = useHistory()
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
            color="secondary"
            disabled={!formik.isValid || !formik.touched.model?.email || !formik.touched.model?.email || loading}
          >
            Logga in
          </Button>
          {errors.message && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errors.message}
            </Alert>
          )}
          {loading && <CenteredCircularProgress color="secondary" />}
        </LoginForm>
      )}
    </Formik>
  )
}
const mapStateToProps = (state: any) => ({
  user: state.user,
  UI: state.UI,
})
const mapDispatchToProps = {
  loginUser,
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminLogin)
