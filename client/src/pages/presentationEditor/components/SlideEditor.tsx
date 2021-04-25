import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getTypes } from '../../../actions/typesAction'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import RndComponent from './RndComponent'
import { SlideEditorContainer, SlideEditorContainerRatio, SlideEditorPaper } from './styled'

const SlideEditor: React.FC = () => {
  const components = useAppSelector(
    (state) =>
      state.editor.competition.slides.find((slide) => slide && slide.id === state.editor.activeSlideId)?.components
  )
  const dispatch = useAppDispatch()
  const editorPaperRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  useEffect(() => {
    dispatch(getTypes())
  }, [])

  useLayoutEffect(() => {
    const updateScale = () => {
      if (editorPaperRef.current) {
        setWidth(editorPaperRef.current.clientWidth)
        setHeight(editorPaperRef.current.clientHeight)
      }
    }
    window.addEventListener('resize', updateScale)
    updateScale()
    return () => window.removeEventListener('resize', updateScale)
  }, [])
  return (
    <SlideEditorContainer>
      <SlideEditorContainerRatio>
        <SlideEditorPaper ref={editorPaperRef}>
          {components &&
            components.map((component) => (
              <RndComponent height={height} width={width} key={component.id} component={component} />
            ))}
        </SlideEditorPaper>
      </SlideEditorContainerRatio>
    </SlideEditorContainer>
  )
}

export default SlideEditor
