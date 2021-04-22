import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEditorCompetition } from '../../../actions/editor'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { TextComponent } from '../../../interfaces/ApiModels'
import { DeleteTextButton } from './styled'

type ImageComponentProps = {
  component: TextComponent
}

interface CompetitionParams {
  id: string
}

const TextComponentEdit = ({ component }: ImageComponentProps) => {
  const { id }: CompetitionParams = useParams()
  const competitionId = useAppSelector((state) => state.editor.competition.id)
  const [content, setContent] = useState('')
  const [timerHandle, setTimerHandle] = React.useState<number | undefined>(undefined)
  const activeSlideId = useAppSelector((state) => state.editor.activeSlideId)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setContent(component.data.text)
  }, [])

  const handleSaveText = async (a: string) => {
    setContent(a)
    if (timerHandle) {
      clearTimeout(timerHandle)
      setTimerHandle(undefined)
    }
    //Only updates 250ms after last input was made to not spam
    setTimerHandle(
      window.setTimeout(async () => {
        console.log('Content was updated on server. id: ', component.id)
        await axios.put(`/competitions/${competitionId}/slides/${activeSlideId}/components/${component.id}`, {
          data: { ...component.data, text: a },
        })
        dispatch(getEditorCompetition(id))
      }, 250)
    )
  }

  const handleDeleteText = async (componentId: number) => {
    await axios.delete(`/competitions/${id}/slides/${activeSlideId}/components/${componentId}`)
    dispatch(getEditorCompetition(id))
  }

  return (
    <div style={{ minHeight: '300px', height: '100%', width: '100%' }}>
      <Editor
        value={content || ''}
        init={{
          height: '300px',
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo save | fontselect | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help',
        }}
        onEditorChange={(a, e) => handleSaveText(a)}
      />
      <DeleteTextButton variant="contained" color="secondary" onClick={() => handleDeleteText(component.id)}>
        Ta bort
      </DeleteTextButton>
    </div>
  )
}

export default TextComponentEdit
