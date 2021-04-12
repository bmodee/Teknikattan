import React from 'react'
import { ComponentTypes } from '../../../enum/ComponentTypes'
import CheckboxComponent from './CheckboxComponent'
import ImageComponentDisplay from './ImageComponentDisplay'
import { SlideEditorContainer } from './styled'
import TextComponentDisplay from './TextComponentDisplay'

const SlideEditor: React.FC = () => {
  // const components =  useAppSelector(state => state.editor.slide.components) // get the current RichSlide
  const components: any[] = [
    { id: 0, x: 15, y: 150, w: 200, h: 300, type: ComponentTypes.Checkbox },
    { id: 1, x: 15, y: 250, w: 200, h: 300, type: ComponentTypes.Checkbox },
    { id: 2, x: 15, y: 350, w: 200, h: 300, type: ComponentTypes.Checkbox },
    { id: 3, x: 300, y: 500, w: 100, h: 300, type: ComponentTypes.Text, text: 'text component', font: 'arial' },
    { id: 4, x: 250, y: 100, w: 200, h: 300, type: ComponentTypes.Image },
    { id: 5, x: 350, y: 100, w: 200, h: 300, type: ComponentTypes.Image },
  ]
  return (
    <SlideEditorContainer>
      {components.map((component) => {
        switch (component.type) {
          case ComponentTypes.Checkbox:
            return <CheckboxComponent key={component.id} component={component} />
            break
          case ComponentTypes.Text:
            return <TextComponentDisplay key={component.id} component={component} />
            break
          case ComponentTypes.Image:
            return <ImageComponentDisplay key={component.id} component={component} />
            break
          default:
            break
        }
      })}
    </SlideEditorContainer>
  )
}

export default SlideEditor
