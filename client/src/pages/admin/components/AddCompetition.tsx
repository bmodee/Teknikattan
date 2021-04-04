import { Button, FormControl, InputLabel, MenuItem, Popover, TextField } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { getCompetitions } from '../../../actions/competitions'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { City } from '../../../interfaces/City'
import { AddCompetitionModel } from '../../../interfaces/models'
import { AddCompetitionButton, AddCompetitionContent, AddCompetitionForm } from './styled'

interface ServerResponse {
  code: number
  message: string
}

interface AddCompetitionFormModel {
  model: AddCompetitionModel
  error?: string
}
const noCitySelected = 'Välj stad'

const competitionSchema: Yup.SchemaOf<AddCompetitionFormModel> = Yup.object({
  model: Yup.object()
    .shape({
      name: Yup.string().required('Namn krävs'),
      city: Yup.string().required('Stad krävs').notOneOf([noCitySelected], 'Välj en stad'),
      year: Yup.number()
        .integer('År måste vara ett heltal')
        .required('År krävs')
        .moreThan(1999, 'År måste vara minst 2000'),
    })
    .required(),
  error: Yup.string().optional(),
})

const AddCompetition: React.FC = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [selectedCity, setSelectedCity] = React.useState<City | undefined>()
  const cities = useAppSelector((state) => state.cities)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const dispatch = useAppDispatch()
  const id = open ? 'simple-popover' : undefined
  const currentYear = new Date().getFullYear()
  const handleCompetitionSubmit = async (
    values: AddCompetitionFormModel,
    actions: FormikHelpers<AddCompetitionFormModel>
  ) => {
    const params = {
      name: values.model.name,
      year: values.model.year,
      city_id: selectedCity?.id as number,
      style_id: 1,
    }
    await axios
      .post<ServerResponse>('/competitions', params)
      .then(() => {
        actions.resetForm()
        setAnchorEl(null)
        dispatch(getCompetitions())
        setSelectedCity(undefined)
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

  const competitionInitialValues: AddCompetitionFormModel = {
    model: { name: '', city: noCitySelected, year: currentYear },
  }
  return (
    <div>
      <AddCompetitionButton color="secondary" variant="contained" onClick={handleClick}>
        Ny Tävling
      </AddCompetitionButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <AddCompetitionContent>
          <Formik
            initialValues={competitionInitialValues}
            validationSchema={competitionSchema}
            onSubmit={handleCompetitionSubmit}
          >
            {(formik) => (
              <AddCompetitionForm onSubmit={formik.handleSubmit}>
                <TextField
                  label="Namn"
                  name="model.name"
                  helperText={formik.touched.model?.name ? formik.errors.model?.name : ''}
                  error={Boolean(formik.touched.model?.name && formik.errors.model?.name)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  margin="normal"
                />
                <FormControl>
                  <InputLabel shrink id="demo-customized-select-native">
                    Region
                  </InputLabel>
                  <TextField
                    select
                    name="model.city"
                    id="standard-select-currency"
                    value={selectedCity ? selectedCity.name : noCitySelected}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.errors.model?.city && formik.touched.model?.city)}
                    helperText={formik.touched.model?.city && formik.errors.model?.city}
                    margin="normal"
                  >
                    <MenuItem value={noCitySelected} onClick={() => setSelectedCity(undefined)}>
                      {noCitySelected}
                    </MenuItem>
                    {cities &&
                      cities.map((city) => (
                        <MenuItem key={city.name} value={city.name} onClick={() => setSelectedCity(city)}>
                          {city.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </FormControl>
                <TextField
                  label="År"
                  name="model.year"
                  type="number"
                  defaultValue={formik.initialValues.model.year}
                  helperText={formik.touched.model?.year ? formik.errors.model?.year : ''}
                  error={Boolean(formik.touched.model?.year && formik.errors.model?.year)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  margin="normal"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={!formik.isValid || !formik.values.model?.name || !formik.values.model?.city}
                >
                  Skapa
                </Button>
                {formik.errors.error && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {formik.errors.error}
                  </Alert>
                )}
              </AddCompetitionForm>
            )}
          </Formik>
        </AddCompetitionContent>
      </Popover>
    </div>
  )
}

export default AddCompetition