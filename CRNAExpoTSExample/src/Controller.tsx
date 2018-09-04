import React, { Component } from 'react'
import Joistick from './Joistick'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import gql from 'graphql-tag'

const SET_WHEEL_SPEED = gql`
  mutation SetWheelSpeed($left: Float, $right: Float) {
    setMotor(left: $left, right: $right) {
      ok
    }
  }
`
const MOVE_CAMERA = gql`
  mutation SetWheelSpeed($channel: Int, $pulse: Int) {
    look(channel: $channel, pulse: $pulse) {
      ok
    }
  }
`

const Feeder = compose(
  graphql(SET_WHEEL_SPEED, { name: 'setMotors' }),
  graphql(MOVE_CAMERA, { name: 'setCamera' })
)

class Controller extends Component {
  render() {
    return <Joistick />
  }
}

export default Feeder(Controller)
