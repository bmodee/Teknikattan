import React from 'react'
import { useAppSelector } from '../../../hooks'
import RndComponent from './RndComponent'
import { SlideEditorContainer, SlideEditorContainerRatio, SlideEditorPaper } from './styled'

const SlideEditor: React.FC = () => {
  const components = useAppSelector(
    (state) =>
      state.editor.competition.slides.find((slide) => slide && slide.id === state.editor.activeSlideId)?.components
  )
  return (
    <SlideEditorContainer>
      <SlideEditorContainerRatio>
        <SlideEditorPaper>
          {components && components.map((component) => <RndComponent key={component.id} component={component} />)}
        </SlideEditorPaper>
      </SlideEditorContainerRatio>
    </SlideEditorContainer>
  )
}

export default SlideEditor
