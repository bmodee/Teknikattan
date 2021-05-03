import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined'
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import React from 'react'
import { RichSlide } from '../interfaces/ApiRichModels'

export const renderSlideIcon = (slide: RichSlide) => {
  if (slide.questions && slide.questions[0] && slide.questions[0].type_id) {
    switch (slide.questions[0].type_id) {
      case 1:
        return <CreateOutlinedIcon /> // text question
      case 2:
        return <BuildOutlinedIcon /> // practical qustion
      case 3:
        return <CheckBoxOutlinedIcon /> // multiple choice question
      case 4:
        return <RadioButtonCheckedIcon /> // single choice question
    }
  } else {
    return <InfoOutlinedIcon /> // information slide
  }
}
