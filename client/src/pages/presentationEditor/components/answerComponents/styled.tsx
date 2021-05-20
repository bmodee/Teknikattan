import { Card } from '@material-ui/core'
import styled from 'styled-components'

export const AnswerTextFieldContainer = styled.div`
  height: calc(100% - 90px);
`
export const MatchContainer = styled.div`
  margin-bottom: 50px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
`

export const MatchCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  min-width: 150px;
  margin-bottom: 5px;
`

export const MatchIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  margin-bottom: 5px;
`

export const MatchButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 5px;
`

export const MatchCorrectContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
