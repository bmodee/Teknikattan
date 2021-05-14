/** Add a user component */

import { Button, FormControl, InputLabel, MenuItem, Popover, TextField } from '@material-ui/core'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { Alert, AlertTitle } from '@material-ui/lab'
import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { getSearchUsers } from '../../../actions/searchUser'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { City, Role } from '../../../interfaces/ApiModels'
import { AddUserModel, FormModel } from '../../../interfaces/FormModels'
import { AddButton, AddContent, AddForm } from '../styledComp'

type formType = FormModel<AddUserModel>

const noRoleSelected = 'Välj roll'
const noCitySelected = 'Välj stad'

/** Form when adding a user with some constraints */
const userSchema: Yup.SchemaOf<formType> = Yup.object({
  model: Yup.object()
    .shape({
      name: Yup.string(),
      email: Yup.string().email().required('Email krävs'),
      password: Yup.string().required('Lösenord krävs.').min(6, 'Lösenord måste vara minst 6 tecken.'),
      role: Yup.string().required('Roll krävs').notOneOf([noCitySelected], 'Välj en roll'),
      city: Yup.string().required('Stad krävs').notOneOf([noRoleSelected], 'Välj en stad'),
    })
    .required(),
  error: Yup.string().optional(),
})

const AddUser: React.FC = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<Role | undefined>()
  const roles = useAppSelector((state) => state.roles.roles)

  const [selectedCity, setSelectedCity] = React.useState<City | undefined>()
  const cities = useAppSelector((state) => state.cities.cities)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const dispatch = useAppDispatch()
  const id = open ? 'simple-popover' : undefined
  const handleSubmit = async (values: formType, actions: FormikHelpers<formType>) => {
    const params = {
      email: values.model.email,
      password: values.model.password,
      //name: values.model.name,
      city_id: selectedCity?.id as number,
      role_id: selectedRole?.id as number,
    }
    await axios
      .post('/api/auth/signup', params)
      .then(() => {
        actions.resetForm()
        setAnchorEl(null)
        dispatch(getSearchUsers())
        setSelectedCity(undefined)
        setSelectedRole(undefined)
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

  const userInitialValues: formType = {
    model: { email: '', password: '', name: '', city: noCitySelected, role: noRoleSelected },
  }
  return (
    <div>
      <AddButton
        data-testid="addUserButton"
        color="secondary"
        variant="contained"
        onClick={handleClick}
        endIcon={<PersonAddIcon />}
      >
        Ny Användare
      </AddButton>
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
          <Formik initialValues={userInitialValues} validationSchema={userSchema} onSubmit={handleSubmit}>
            {(formik) => (
              <AddForm onSubmit={formik.handleSubmit}>
                <TextField
                  data-testid="addUserEmail"
                  label="Email"
                  name="model.email"
                  helperText={formik.touched.model?.email ? formik.errors.model?.email : ''}
                  error={Boolean(formik.touched.model?.email && formik.errors.model?.email)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  margin="normal"
                />
                <TextField
                  data-testid="addUserPassword"
                  label="Lösenord"
                  name="model.password"
                  helperText={formik.touched.model?.password ? formik.errors.model?.password : ''}
                  error={Boolean(formik.touched.model?.password && formik.errors.model?.password)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  margin="normal"
                />
                <TextField
                  data-testid="addUserName"
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
                    data-testid="userCitySelect"
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
                        <MenuItem
                          key={city.name}
                          value={city.name}
                          onClick={() => setSelectedCity(city)}
                          data-testid={city.name}
                        >
                          {city.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </FormControl>

                <FormControl>
                  <InputLabel shrink id="demo-customized-select-native">
                    Roll
                  </InputLabel>
                  <TextField
                    select
                    data-testid="userRoleSelect"
                    name="model.role"
                    id="standard-select-currency"
                    value={selectedRole ? selectedRole.name : noRoleSelected}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.errors.model?.role && formik.touched.model?.role)}
                    helperText={formik.touched.model?.role && formik.errors.model?.role}
                    margin="normal"
                  >
                    <MenuItem value={noRoleSelected} onClick={() => setSelectedRole(undefined)}>
                      {noRoleSelected}
                    </MenuItem>
                    {roles &&
                      roles.map((role) => (
                        <MenuItem
                          key={role.name}
                          value={role.name}
                          onClick={() => setSelectedRole(role)}
                          data-testid={role.name}
                        >
                          {role.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </FormControl>

                <Button
                  type="submit"
                  data-testid="addUserSubmit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={
                    !formik.isValid ||
                    !formik.values.model?.email ||
                    !formik.values.model?.password ||
                    !selectedCity?.name ||
                    !selectedRole?.name
                  }
                >
                  Lägg till
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

export default AddUser
