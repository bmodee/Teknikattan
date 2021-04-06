import { fireEvent, render, screen } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import store from '../../../store'
import AddCompetition from './AddCompetition'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

fit('renders add competition', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <AddCompetition />
      </Provider>
    </BrowserRouter>
  )
})

fit('it adds competitions', () => {
  const cities = [
    {
      id: 1,
      name: 'Link\u00f6ping',
    },
    {
      id: 2,
      name: 'Stockholm',
    },
  ]
  const store = mockStore({ cities })
  // console.log(store.getState())
  const wrapper = mount(
    <Provider store={store}>
      <AddCompetition />
    </Provider>
  )
  const newCompetitionButton = wrapper.find('button')
  newCompetitionButton.simulate('click')
  const nameField = screen.getByRole('textbox')
  // const nameField = textFields.children().first()

  // nameField.simulate('focus')
  // nameField.simulate('change', { target: { value: 'Changed' } })
  console.log(nameField)
  fireEvent.click(nameField)
  expect(wrapper.text().includes('2')).toBe(true) //TODO: check that SlideSettings exists
})
