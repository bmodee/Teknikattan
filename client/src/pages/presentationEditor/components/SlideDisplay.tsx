import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getTypes } from '../../../actions/typesAction'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import PresentationComponent from '../../views/components/PresentationComponent'
import RndComponent from './RndComponent'
import { SlideEditorContainer, SlideEditorContainerRatio, SlideEditorPaper } from './styled'

type SlideDisplayProps = {
  //Prop to distinguish between editor and active competition
  editor?: boolean | undefined
}

const SlideDisplay = ({ editor }: SlideDisplayProps) => {
  const components = useAppSelector((state) => {
    if (editor)
      return state.editor.competition.slides.find((slide) => slide.id === state.editor.activeSlideId)?.components
    return state.presentation.competition.slides.find((slide) => slide.id === state.presentation.slide?.id)?.components
  })
  const dispatch = useAppDispatch()
  const editorPaperRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  //Makes scale close to 1, 800 height is approxemately for a 1920 by 1080 monitor
  const scale = height / 800
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
            components.map((component) => {
              if (editor)
                return (
                  <RndComponent height={height} width={width} key={component.id} component={component} scale={scale} />
                )
              return (
                <PresentationComponent
                  height={height}
                  width={width}
                  key={component.id}
                  component={component}
                  scale={scale}
                />
              )
            })}
        </SlideEditorPaper>
      </SlideEditorContainerRatio>
    </SlideEditorContainer>
  )
}

export default SlideDisplay
