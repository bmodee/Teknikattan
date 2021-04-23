import { Button, FormControl, InputLabel, MenuItem, Popover, TextField } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { getCompetitions } from '../../../actions/competitions'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { City } from '../../../interfaces/ApiModels'
import { AddCompetitionModel, FormModel } from '../../../interfaces/FormModels'
import { AddButton, AddContent, AddForm } from '../styledComp'

/**
 * Component description:
 * This component handles the functionality when adding a competition to the system
 * This component is a child component to CompetitionManager.tsx
 */

type formType = FormModel<AddCompetitionModel>

const noCitySelected = 'Välj stad'

//Description of the form and what is required
const competitionSchema: Yup.SchemaOf<formType> = Yup.object({
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
  const cities = useAppSelector((state) => state.cities.cities)
  const currentUser = useAppSelector((state) => state.user.userInfo)
  const userCity = cities.find((city) => city.id === currentUser?.city_id)
  const [selectedCity, setSelectedCity] = React.useState<City | undefined>(userCity)
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

  // Handles the actual submition to the database
  const handleCompetitionSubmit = async (values: formType, actions: FormikHelpers<formType>) => {
    // The parameters sent
    const params = {
      name: values.model.name,
      year: values.model.year,
      city_id: selectedCity?.id as number,
    }

    await axios
      .post('/api/competitions', params) // send to database
      .then(() => {
        actions.resetForm() // reset the form
        setAnchorEl(null)
        dispatch(getCompetitions()) // refresh competitions
        setSelectedCity(undefined)
      })
      // if the post request fails
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

  const competitionInitialValues: formType = {
    model: { name: '', city: userCity?.name ? userCity.name : noCitySelected, year: currentYear },
  }
  return (
    <div>
      <AddButton
        style={{ backgroundColor: '#4caf50', color: '#fcfcfc' }}
        color="default"
        variant="contained"
        onClick={handleClick}
      >
        Ny Tävling
      </AddButton>

      {/**
       *  The "pop up" menu for adding a competition
       *  contains 3 fields; Name, Region and Year
       *
       */}
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
        <AddContent>
          <Formik
            initialValues={competitionInitialValues}
            validationSchema={competitionSchema}
            onSubmit={handleCompetitionSubmit}
          >
            {(formik) => (
              <AddForm onSubmit={formik.handleSubmit}>
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
              </AddForm>
            )}
          </Formik>
        </AddContent>
      </Popover>
    </div>
  )
}

export default AddCompetition
