import { Editor } from '@tinymce/tinymce-react'
import { mount } from 'enzyme'
import React from 'react'
import TextComponentDisplay from './TextComponentDisplay'

it('renders text component display', () => {
  const testText = 'TEST'
  const container = mount(
    <TextComponentDisplay component={{ id: 0, x: 0, y: 0, w: 0, h: 0, text: testText, type: 2, font: '123123' }} />
  )
  expect(container.find(Editor).prop('initialValue')).toBe(testText)
})
