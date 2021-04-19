import React from 'react'
import { ComponentTypes } from '../../../enum/ComponentTypes'
import { useAppSelector } from '../../../hooks'
import { ImageComponent, TextComponent } from '../../../interfaces/ApiModels'
import CheckboxComponent from './CheckboxComponent'
import ImageComponentDisplay from './ImageComponentDisplay'
import { SlideEditorContainer } from './styled'
import TextComponentDisplay from './TextComponentDisplay'

const SlideEditor: React.FC = () => {
  const components = useAppSelector(
    (state) =>
      state.editor.competition.slides.find((slide) => slide && slide.id === state.editor.activeSlideId)?.components
  )
  return (
    <SlideEditorContainer>
      {components &&
        components.map((component) => {
          switch (component.type_id) {
            case ComponentTypes.Checkbox:
              return <CheckboxComponent key={component.id} component={component} />
            case ComponentTypes.Text:
              return <TextComponentDisplay key={component.id} component={component as TextComponent} />
            case ComponentTypes.Image:
              return <ImageComponentDisplay key={component.id} component={component as ImageComponent} />
            default:
              break
          }
        })}
    </SlideEditorContainer>
  )
}

export default SlideEditor
