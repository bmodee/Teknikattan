import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Popover,
  TextField,
  Theme,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { Alert, AlertTitle } from '@material-ui/lab'
import axios from 'axios'
import { Formik, FormikHelpers } from 'formik'
import React, { useEffect } from 'react'
import * as Yup from 'yup'
import { getSearchUsers } from '../../../actions/searchUser'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { City, Role, User } from '../../../interfaces/ApiModels'
import { EditUserModel, FormModel } from '../../../interfaces/FormModels'
import { AddContent, AddForm } from '../styledComp'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      marginBottom: '10px',
    },
    editButton: {
      marginTop: '20px',
      paddingTop: '10px',
      paddingBottom: '10px',
    },
    deleteButton: {
      marginTop: '40px',
    },
  })
)

type formType = FormModel<EditUserModel>

const noRoleSelected = 'Admin'
const noCitySelected = 'Linköping'

const userSchema: Yup.SchemaOf<formType> = Yup.object({
  model: Yup.object()
    .shape({
      name: Yup.string(),
      email: Yup.string().email().required('Email krävs'),
      password: Yup.string()
        .min(6, 'Lösenord måste vara minst 6 tecken.')
        .matches(/[a-zA-Z]/, 'Lösenord får enbart innehålla a-z, A-Z.'),
      role: Yup.string().required('Roll krävs').notOneOf([noCitySelected], 'Välj en roll'),
      city: Yup.string().required('Stad krävs').notOneOf([noRoleSelected], 'Välj en stad'),
    })
    .required(),
  error: Yup.string().optional(),
})

type UserIdProps = {
  user: User
}

const EditUser = ({ user }: UserIdProps) => {
  // for dialog alert
  const [openAlert, setOpen] = React.useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const dispatch = useAppDispatch()
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<Role | undefined>()
  const roles = useAppSelector((state) => state.roles.roles)

  const [selectedCity, setSelectedCity] = React.useState<City | undefined>()
  const cities = useAppSelector((state) => state.cities.cities)

  const startRole = roles.find((x) => x.id == user.role_id)
  const startCity = cities.find((x) => x.id == user.city_id)

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  useEffect(() => {
    setSelectedCity(startCity)
    setSelectedRole(startRole)
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const handleVerifyDelete = () => {
    setOpen(true)
  }

  const handleDeleteUsers = async () => {
    setOpen(false)
    await axios
      .delete(`/api/auth/delete/${user.id}`)
      .then(() => {
        setAnchorEl(null)
        dispatch(getSearchUsers())
      })
      .catch(({ response }) => {
        console.warn(response.data)
      })
  }

  const handleSubmit = async (values: formType, actions: FormikHelpers<formType>) => {
    const params = {
      email: values.model.email,
      name: values.model.name,
      city_id: selectedCity?.id as number,
      role_id: selectedRole?.id as number,
    }
    const req: any = {}
    if (params.email !== user.email) {
      req['email'] = params.email
    }
    if (params.name !== user.name) {
      req['name'] = params.name
    }
    if (params.city_id !== user.city_id) {
      req['city_id'] = params.city_id
    }
    if (params.role_id !== user.role_id) {
      req['role_id'] = params.role_id
    }
    await axios
      .put('/api/users/' + user.id, req)
      .then(() => {
        setAnchorEl(null)
        dispatch(getSearchUsers())
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
    model: {
      email: user.email as string,
      name: user.name as string,
      city: startCity?.name as string,
      role: startRole?.name as string,
    },
  }
  return (
    <div>
      <Button onClick={handleClick} data-testid={`more-${user.email}`}>
        <MoreHorizIcon />
      </Button>
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
                  className={classes.textField}
                  label="Email"
                  name="model.email"
                  helperText={formik.touched.model?.email ? formik.errors.model?.email : ''}
                  error={Boolean(formik.touched.model?.email && formik.errors.model?.email)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  defaultValue={user.email}
                  margin="normal"
                />
                <TextField
                  className={classes.textField}
                  label="Namn"
                  name="model.name"
                  helperText={formik.touched.model?.name ? formik.errors.model?.name : ''}
                  error={Boolean(formik.touched.model?.name && formik.errors.model?.name)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  defaultValue={user.name}
                  margin="normal"
                />
                <FormControl>
                  <InputLabel shrink id="demo-customized-select-native">
                    Region
                  </InputLabel>
                  <TextField
                    className={classes.textField}
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
                    {cities &&
                      cities.map((city) => (
                        <MenuItem key={city.name} value={city.name} onClick={() => setSelectedCity(city)}>
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
                    className={classes.textField}
                    select
                    name="model.role"
                    id="standard-select-currency"
                    value={selectedRole ? selectedRole.name : noRoleSelected}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.errors.model?.role && formik.touched.model?.role)}
                    helperText={formik.touched.model?.role && formik.errors.model?.role}
                    margin="normal"
                  >
                    {roles &&
                      roles.map((role) => (
                        <MenuItem key={role.name} value={role.name} onClick={() => setSelectedRole(role)}>
                          {role.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </FormControl>

                <FormControl>
                  <InputLabel shrink id="demo-customized-select-native">
                    Password
                  </InputLabel>
                  <TextField
                    className={classes.textField}
                    label="Lösenord"
                    name="model.password"
                    helperText={formik.touched.model?.password ? formik.errors.model?.password : ''}
                    error={Boolean(formik.touched.model?.password && formik.errors.model?.password)}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultValue=""
                    margin="normal"
                    type="password"
                  />
                </FormControl>

                <Button
                  className={classes.editButton}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={!formik.isValid || !formik.values.model?.role || !formik.values.model?.city}
                >
                  Ändra
                </Button>
                <Button
                  data-testid="removeUser"
                  onClick={handleVerifyDelete}
                  className={classes.deleteButton}
                  fullWidth
                  variant="contained"
                  color="secondary"
                >
                  Ta bort
                </Button>
                <Dialog
                  fullScreen={fullScreen}
                  open={openAlert}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">{'Ta bort användare?'}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Är du säker på att du vill ta bort användaren och all dess information från systemet?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                      Avbryt
                    </Button>
                    <Button data-testid="acceptRemoveUser" onClick={handleDeleteUsers} color="primary" autoFocus>
                      Ta bort
                    </Button>
                  </DialogActions>
                </Dialog>

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

export default EditUser
