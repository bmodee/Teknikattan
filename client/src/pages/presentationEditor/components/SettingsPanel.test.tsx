import { render } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../store'
import CompetitionSettings from './CompetitionSettings'
import SettingsPanel from './SettingsPanel'
import SlideSettings from './SlideSettings'

it('renders settings panel', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <SettingsPanel />
      </BrowserRouter>
    </Provider>
  )
})

it('renders slide settings tab', () => {
  const wrapper = mount(
    <Provider store={store}>
      <BrowserRouter>
        <SettingsPanel />
      </BrowserRouter>
    </Provider>
  )
  const tabs = wrapper.find('.MuiTabs-flexContainer')
  expect(wrapper.find(CompetitionSettings).length).toEqual(1)
  tabs.children().at(1).simulate('click')
  expect(wrapper.find(SlideSettings).length).toEqual(1)
})
