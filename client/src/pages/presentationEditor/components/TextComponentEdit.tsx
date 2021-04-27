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
    setContent(component.text)
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
        await axios.put(`/api/competitions/${competitionId}/slides/${activeSlideId}/components/${component.id}`, {
          text: a,
        })
        dispatch(getEditorCompetition(id))
      }, 250)
    )
  }

  const handleDeleteText = async (componentId: number) => {
    await axios.delete(`/api/competitions/${id}/slides/${activeSlideId}/components/${componentId}`)
    dispatch(getEditorCompetition(id))
  }

  return (
    <div style={{ minHeight: '300px', height: '100%', width: '100%' }}>
      <Editor
        value={content || ''}
        init={{
          height: '300px',
          menubar: false,
          font_formats:
            ' Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif;\
             Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Calibri=calibri;\
             Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier;\
              Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol;\
               Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco;\
                Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva;\
                Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
          fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt 120pt 144pt',
          content_style: 'body {font-size: 24pt; font-family: Calibri;}',
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'fontsizeselect | bold italic backcolor | help | \
            fontselect | formatselect | undo redo | \
            alignleft aligncenter alignright alignjustify bullist numlist outdent indent | removeformat |',
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
