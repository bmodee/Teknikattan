import { Card, Typography } from '@material-ui/core'
import TimerIcon from '@material-ui/icons/Timer'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getTypes } from '../../../actions/typesAction'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import PresentationComponent from '../../views/components/PresentationComponent'
import Timer from '../../views/components/Timer'
import RndComponent from './RndComponent'
import { Center, SlideDisplayText, SlideEditorContainer, SlideEditorContainerRatio, SlideEditorPaper } from './styled'

type SlideDisplayProps = {
  //Prop to distinguish between editor and active competition
  variant: 'editor' | 'presentation'
  activeViewTypeId: number
  //Can be used to force what slide it it's displaying (currently used in judge view)
  currentSlideId?: number
}

const SlideDisplay = ({ variant, activeViewTypeId, currentSlideId }: SlideDisplayProps) => {
  const slide = useAppSelector((state) => {
    if (currentSlideId && variant === 'presentation')
      return state.presentation.competition.slides.find((slide) => slide.id === currentSlideId)
    if (variant === 'editor')
      return state.editor.competition.slides.find((slide) => slide.id === state.editor.activeSlideId)
    return state.presentation.competition.slides.find((slide) => slide.id === state.presentation.activeSlideId)
  })
  const totalSlides = useAppSelector((state) => {
    if (variant === 'presentation') return state.presentation.competition.slides.length
    return state.editor.competition.slides.length
  })
  const components = slide?.components
  const competitionBackgroundImage = useAppSelector((state) => {
    if (variant === 'editor') return state.editor.competition.background_image
    return state.presentation.competition.background_image
  })

  const slideBackgroundImage = slide?.background_image
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
          <SlideDisplayText $scale={scale}>
            {slide?.timer && (
              <Card style={{ display: 'flex', alignItems: 'center', padding: 10 }}>
                <TimerIcon fontSize="large" />
                <Timer variant={variant} />
              </Card>
            )}
          </SlideDisplayText>
          <SlideDisplayText $scale={scale} $right>
            <Card style={{ padding: 10 }}>{slide && `${slide?.order + 1} / ${totalSlides}`}</Card>
          </SlideDisplayText>
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
                    key={component.id}
                    component={component}
                    scale={scale}
                    currentSlideId={currentSlideId}
                  />
                )
              })}
          {!slide && (
            <Center>
              <Typography variant="body2"> Ingen sida är vald, välj en i vänstermenyn eller skapa en ny.</Typography>
            </Center>
          )}
        </SlideEditorPaper>
      </SlideEditorContainerRatio>
    </SlideEditorContainer>
  )
}

export default SlideDisplay
