import { render } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import CompetitionSettings from './CompetitionSettings'
import SettingsPanel from './SettingsPanel'

it('renders settings panel', () => {
  render(<SettingsPanel />)
})

it('renders slide settings tab', () => {
  const wrapper = mount(<SettingsPanel />)
  const tabs = wrapper.find('.MuiTabs-flexContainer')
  expect(wrapper.find(CompetitionSettings).length).toEqual(1)
  tabs.children().at(1).simulate('click')
  expect(wrapper.text().includes('2')).toBe(true) //TODO: check that SlideSettings exists
})
