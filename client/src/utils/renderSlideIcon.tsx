import { RichSlide } from '../interfaces/ApiRichModels'
import React from 'react'
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

export const renderSlideIcon = (slide: RichSlide) => {
  if (slide.questions && slide.questions[0] && slide.questions[0].type_id) {
    switch (slide.questions[0].type_id) {
      case 1:
        return <CreateOutlinedIcon /> // text question
      case 2:
        return <BuildOutlinedIcon /> // practical qustion
      case 3:
        return <DnsOutlinedIcon /> // multiple choice question
    }
  } else {
    return <InfoOutlinedIcon /> // information slide
  }
}
