import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined'
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import { shallow } from 'enzyme'
import { RichSlide } from '../interfaces/ApiRichModels'
import { renderSlideIcon } from './renderSlideIcon'

it('returns CreateOutlinedIcon correctly ', async () => {
  const testSlide = { questions: [{ id: 5, type_id: 1 }] } as RichSlide
  const icon = renderSlideIcon(testSlide)
  expect(icon).toBeDefined()
  if (icon) {
    const actualResult = shallow(icon)
    const expectedResult = shallow(<CreateOutlinedIcon />)
    expect(actualResult).toEqual(expectedResult)
  }
})

it('returns BuildOutlinedIcon  correctly ', async () => {
  const testSlide = { questions: [{ id: 5, type_id: 2 }] } as RichSlide
  const icon = renderSlideIcon(testSlide)
  expect(icon).toBeDefined()
  if (icon) {
    const actualResult = shallow(icon)
    const expectedResult = shallow(<BuildOutlinedIcon />)
    expect(actualResult).toEqual(expectedResult)
  }
})

it('returns DnsOutlinedIcon  correctly ', async () => {
  const testSlide = { questions: [{ id: 5, type_id: 3 }] } as RichSlide
  const icon = renderSlideIcon(testSlide)
  expect(icon).toBeDefined()
  if (icon) {
    const actualResult = shallow(icon)
    const expectedResult = shallow(<CheckBoxOutlinedIcon />)
    expect(actualResult).toEqual(expectedResult)
  }
})

it('returns DnsOutlinedIcon  correctly ', async () => {
  const testSlide = { questions: [{ id: 5, type_id: 4 }] } as RichSlide
  const icon = renderSlideIcon(testSlide)
  expect(icon).toBeDefined()
  if (icon) {
    const actualResult = shallow(icon)
    const expectedResult = shallow(<RadioButtonCheckedIcon />)
    expect(actualResult).toEqual(expectedResult)
  }
})

it('defaults to InfoOutlinedIcon', async () => {
  const testSlide = {} as RichSlide
  const icon = renderSlideIcon(testSlide)
  expect(icon).toBeDefined()
  if (icon) {
    const actualResult = shallow(icon)
    const expectedResult = shallow(<InfoOutlinedIcon />)
    expect(actualResult).toEqual(expectedResult)
  }
})
