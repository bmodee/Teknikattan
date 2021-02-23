import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { LoginModel } from '../interfaces/models'

interface LoginState {
  status: number
  message: string
}

interface LoginFormModel {
  model: LoginModel
  error?: string
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

const LoginForm: React.FC = () => {
  const [serverState, setServerState] = useState<LoginFormModel>()
  const initialValues: LoginFormModel = { model: { email: '', password: '' } }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, actions) => {
        await axios
          .post(`users/login`, values.model)
          .then((res) => {
            actions.resetForm()
          })
          .catch((error) => {
            actions.setFieldError('error', 'Invalid email or password')
          })
          .finally(() => {
            actions.setSubmitting(false)
          })
      }}
    >
      {(formik) => (
        <Form>
          <div className="form-group">
            <label htmlFor="model.email">Email Address</label>
            <Field name="model.email" type="email" className="form-control" />
            <ErrorMessage name="model.email">
              {(msg) => <div className="text-danger">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="form-group">
            <label htmlFor="model.password">Password</label>
            <Field
              name="model.password"
              type="password"
              className="form-control"
            />
            <ErrorMessage name="model.password">
              {(msg) => <div className="text-danger">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <div className="form-group">
            <ErrorMessage name="error">
              {(msg) => <div className="text-danger">{msg}</div>}
            </ErrorMessage>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
