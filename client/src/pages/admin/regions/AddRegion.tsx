import { Grid, TextField } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { Alert, AlertTitle } from '@material-ui/lab'
import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { getCities } from '../../../actions/cities'
import { useAppDispatch } from '../../../hooks'
import { AddCityModel, FormModel } from '../../../interfaces/FormModels'
import { AddButton, AddForm } from '../styledComp'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      width: '100%',
    },
    margin: {
      margin: theme.spacing(1),
    },
    button: {
      width: '40px',
      height: '40px',
      marginTop: '20px',
    },
  })
)

type formType = FormModel<AddCityModel>

const schema: Yup.SchemaOf<formType> = Yup.object({
  model: Yup.object()
    .shape({
      name: Yup.string()
        .required('Minst två bokstäver krävs')
        .min(2)
        .matches(/[a-zA-Z]/, 'Namnet får enbart innehålla a-z, A-Z.'),
    })
    .required(),
  error: Yup.string().optional(),
})

const AddRegion: React.FC = (props: any) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const handleSubmit = async (values: formType, actions: FormikHelpers<formType>) => {
    const params = {
      name: values.model.name,
    }
    await axios
      .post('/misc/cities', params)
      .then(() => {
        actions.resetForm()
        dispatch(getCities())
      })
      .catch(({ response }) => {
        console.warn(response.data)
        if (response.data && response.data.message)
          actions.setFieldError('error', response.data && response.data.message)
        else actions.setFieldError('error', 'Something went wrong, please try again')
      })
      .finally(() => {
        actions.setSubmitting(false)
      })
  }

  const initValues: formType = {
    model: { name: '' },
  }

  return (
    <Formik initialValues={initValues} validationSchema={schema} onSubmit={handleSubmit}>
      {(formik) => (
        <AddForm onSubmit={formik.handleSubmit}>
          <FormControl className={classes.margin}>
            <Grid container={true}>
              <TextField
                className={classes.margin}
                helperText={formik.touched.model?.name ? formik.errors.model?.name : ''}
                error={Boolean(formik.touched.model?.name && formik.errors.model?.name)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="model.name"
                label="Region"
              ></TextField>
              <AddButton
                style={{ backgroundColor: '#4caf50', color: '#fcfcfc' }}
                className={classes.button}
                color="default"
                variant="contained"
                type="submit"
              >
                <AddIcon></AddIcon>
              </AddButton>
            </Grid>
          </FormControl>
          {formik.errors.error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {formik.errors.error}
            </Alert>
          )}
        </AddForm>
      )}
    </Formik>
  )
}

export default AddRegion