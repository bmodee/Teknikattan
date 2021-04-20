import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import { useAppSelector } from '../../../hooks'
import { TextComponent } from '../../../interfaces/ApiModels'
import { Position, Size } from '../../../interfaces/Components'

type ImageComponentProps = {
  component: TextComponent
}

const TextComponentDisplay = ({ component }: ImageComponentProps) => {
  const [currentPos, setCurrentPos] = useState<Position>({ x: component.x, y: component.y })
  const [currentSize, setCurrentSize] = useState<Size>({ w: component.w, h: component.h })
  const competitionId = useAppSelector((state) => state.editor.competition.id)
  const slideId = useAppSelector((state) => state.editor.activeSlideId)
  if (component.id === 1) console.log(component)
  const handleEditorChange = (e: any) => {
    console.log('Content was updated:', e.target.getContent())
    axios.put(`/competitions/${competitionId}/slides/${slideId}/components/${component.id}`, {
      data: { ...component.data, text: e.target.getContent() },
    })
  }
  const handleUpdatePos = (pos: Position) => {
    axios.put(`/competitions/${competitionId}/slides/${slideId}/components/${component.id}`, {
      x: pos.x,
      y: pos.y,
    })
  }
  const handleUpdateSize = () => {
    axios.put(`/competitions/${competitionId}/slides/${slideId}/components/${component.id}`, {
      w: currentSize.w,
      h: currentSize.h,
    })
  }
  return (
    <Rnd
      minWidth={50}
      minHeight={50}
      bounds="parent"
      onDragStop={(e, d) => {
        setCurrentPos({ x: d.x, y: d.y })
        handleUpdatePos(d)
      }}
      size={{ width: currentSize.w, height: currentSize.h }}
      position={{ x: currentPos.x, y: currentPos.y }}
      onResize={(e, direction, ref, delta, position) => {
        setCurrentSize({
          w: ref.offsetWidth,
          h: ref.offsetHeight,
        })
        setCurrentPos(position)
      }}
      onResizeStop={handleUpdateSize}
    >
      <div style={{ height: '100%', width: '100%' }}>
        <Editor
          initialValue={component.data.text}
          init={{
            height: '100%',
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
              'undo redo | formatselect | fontselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help',
          }}
          onChange={handleEditorChange}
        />
      </div>
    </Rnd>
  )
}

export default TextComponentDisplay
