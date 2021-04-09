import { TextField } from '@material-ui/core'
import styled from 'styled-components'

export const SlideContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const ScoreDisplayContainer = styled.div`
  padding-top: 5px;
  padding-right: 10px;
  padding-left: 10px;
`

export const ScoreDisplayHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

export const ScoreInput = styled(TextField)`
  width: 40px;
`

export const AnswerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`
