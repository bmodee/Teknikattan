import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getTypes } from '../../../actions/typesAction'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import PresentationComponent from '../../views/components/PresentationComponent'
import RndComponent from './RndComponent'
import { SlideEditorContainer, SlideEditorContainerRatio, SlideEditorPaper } from './styled'

type SlideDisplayProps = {
  //Prop to distinguish between editor and active competition
  variant: 'editor' | 'presentation'
  activeViewTypeId: number
}

const SlideDisplay = ({ variant, activeViewTypeId }: SlideDisplayProps) => {
  const components = useAppSelector((state) => {
    if (variant === 'editor')
      return state.editor.competition.slides.find((slide) => slide.id === state.editor.activeSlideId)?.components
    return state.presentation.competition.slides.find((slide) => slide.id === state.presentation.slide?.id)?.components
  })
  const competitionBackgroundImage = useAppSelector((state) => {
    if (variant === 'editor') return state.editor.competition.background_image
    return state.presentation.competition.background_image
  })

  const slideBackgroundImage = useAppSelector((state) => {
    if (variant === 'editor')
      return state.editor.competition.slides.find((slide) => slide.id === state.editor.activeSlideId)?.background_image
    return state.presentation.competition.slides.find((slide) => slide.id === state.presentation.slide.id)
      ?.background_image
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
          {(competitionBackgroundImage || slideBackgroundImage) && (
            <img
              src={`/static/images/${
                slideBackgroundImage ? slideBackgroundImage.filename : competitionBackgroundImage?.filename
              }`}
              height={height}
              width={width}
              draggable={false}
            />
          )}
          {components &&
            components
              .filter((component) => component.view_type_id === activeViewTypeId)
              .map((component) => {
                if (variant === 'editor')
                  return (
                    <RndComponent
                      height={height}
                      width={width}
                      key={component.id}
                      component={component}
                      scale={scale}
                    />
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
