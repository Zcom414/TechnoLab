/* eslint-disable no-unused-vars */
import React from 'react'
import SectionArduino from './SectionArduino'
import SectionTechnologie from './SectionTechnologie'
import DefinitionArduino from './DefinitionArduino'
import SectionLessons from './SectionLessons'
function Home() {
  return (
    <div>
      <SectionArduino />
      <DefinitionArduino />
      <SectionTechnologie />
      <SectionLessons />
    </div>
  )
}

export default Home
