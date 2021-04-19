import { Editor } from '@tinymce/tinymce-react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../store'
import TextComponentDisplay from './TextComponentDisplay'

it('renders text component display', () => {
  const testText = 'TEST'
  const container = mount(
    <Provider store={store}>
      <TextComponentDisplay
        component={{ id: 0, x: 0, y: 0, w: 0, h: 0, data: { text: testText, font: '123123' }, type_id: 2 }}
      />
    </Provider>
  )
  expect(container.find(Editor).prop('initialValue')).toBe(testText)
})
