import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Component } from '../../../interfaces/ApiModels'
import store from '../../../store'
import RndComponent from './RndComponent'

it('renders rnd component', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <RndComponent component={{ id: 2, x: 0, w: 15, h: 15 } as Component} width={50} height={50} scale={123} />
      </Provider>
    </BrowserRouter>
  )
})
