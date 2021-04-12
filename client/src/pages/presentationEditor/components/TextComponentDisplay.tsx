import { Editor } from '@tinymce/tinymce-react'
import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import { TextComponent } from '../../../interfaces/ApiModels'
import { Position, Size } from '../../../interfaces/Components'

type ImageComponentProps = {
  component: TextComponent
}

const TextComponentDisplay = ({ component }: ImageComponentProps) => {
  const [currentPos, setCurrentPos] = useState<Position>({ x: component.x, y: component.y })
  const [currentSize, setCurrentSize] = useState<Size>({ w: component.w, h: component.h })
  const handleEditorChange = (e: any) => {
    console.log('Content was updated:', e.target.getContent())
    //TODO: axios.post
  }
  return (
    <Rnd
      minWidth={50}
      minHeight={50}
      bounds="parent"
      onDragStop={(e, d) => {
        setCurrentPos({ x: d.x, y: d.y })
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
      onResizeStop={() => {
        console.log('skickar till server')
      }}
    >
      <div style={{ height: '100%', width: '100%' }}>
        <Editor
          initialValue={component.text}
          init={{
            body_class: 'mceBlackBody',
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
