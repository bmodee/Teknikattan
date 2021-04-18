import { List, ListItem, Popover } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getPresentationCompetition, getPresentationTeams, setPresentationCode } from '../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { ViewParams } from '../../interfaces/ViewParams'
import SlideDisplay from './components/SlideDisplay'
import SocketTest from './components/SocketTest'
import Timer from './components/Timer'
import { PresenterButton, PresenterContainer, PresenterFooter, PresenterHeader } from './styled'

const PresenterViewPage: React.FC = () => {
  const teams = useAppSelector((state) => state.presentation.teams)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const { id, code }: ViewParams = useParams()
  const history = useHistory()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getPresentationCompetition(id))
    dispatch(getPresentationTeams(id))
    dispatch(setPresentationCode(code))
  }, [])
  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleNextSlidePressed = () => {
    // dispatch(setCurrentSlideNext())
    // syncSlide()
  }
  const handlePreviousSlidePressed = () => {
    // dispatch(setCurrentSlidePrevious())
    // syncSlide()
  }

  return (
    <PresenterContainer>
      <PresenterHeader>
        <PresenterButton onClick={handleOpenPopover} color="primary" variant="contained">
          Visa ställning
        </PresenterButton>
        <PresenterButton onClick={() => history.push('/admin')} variant="contained" color="secondary">
          Avsluta tävling
        </PresenterButton>
      </PresenterHeader>
      <SlideDisplay />
      <PresenterFooter>
        <PresenterButton onClick={handlePreviousSlidePressed} variant="contained">
          <ChevronRightIcon fontSize="large" />
        </PresenterButton>
        <SocketTest></SocketTest>
        <Timer></Timer>
        <PresenterButton onClick={handleNextSlidePressed} variant="contained">
          <ChevronRightIcon fontSize="large" />
        </PresenterButton>
      </PresenterFooter>
      <Popover
        open={Boolean(anchorEl)}
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
        <List>
          {teams.map((team) => (
            <ListItem key={team.id}>{team.name} score: 20</ListItem>
          ))}
        </List>
      </Popover>
    </PresenterContainer>
  )
}

export default PresenterViewPage
