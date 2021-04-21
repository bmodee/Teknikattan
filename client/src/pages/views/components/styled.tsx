import { TextField } from '@material-ui/core'
import styled from 'styled-components'

export const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5%;
  justify-content: center;
  background-color: grey;
  width: 1280px;
  height: 720px;
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
