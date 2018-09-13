import React, { Component } from 'react'
import Joistick, { PullEvent } from './Joistick'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import gql from 'graphql-tag'
import throttle from 'lodash/throttle'
import { Dimensions, View } from 'react-native'

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

interface Props {
  setMotors: Function,
  setCamera: Function
}

class Controller extends Component<Props> {
  constructor(props: Props) {
    super(props)

    this._handleMotorChange = throttle(this._handleMotorChange, 200)
    this._handleCameraChange = throttle(this._handleCameraChange, 200)
  }
  _handleMotorChange = ({ force, radian }: PullEvent) => {
    const scale = -100 * force
    const sin = -Math.sin(radian)
    const cos = Math.cos(radian)
    let left = sin > 0 ? 1 : sin * 2 + 1
    let right = sin > 0 ? sin * 2 - 1 : -1
    if (cos > 0) {
      const buff = left
      left = right
      right = buff
    }
    console.log({ sin, cos, left, right })
    left *= scale
    right *= scale
    this.props.setMotors({ variables: { left, right } })
  }
  _handleCameraChange = ({ force, radian }: PullEvent) => {
    const scale = (num: number) => 1500 + num * 1000 * force
    const vertical = scale(-Math.sin(radian))
    const horisontal = scale(Math.cos(radian))
    console.log({ vertical, horisontal })
    this.props.setCamera({ variables: { channel: 0, pulse: vertical } })
    this.props.setCamera({ variables: { channel: 1, pulse: horisontal } })
  }
  render() {
    const { width, height } = Dimensions.get('window')
    console.log({width, height})
    return (
      <View>
        <Joistick onChange={this._handleMotorChange} top={180} left={width/2} pullBack/>
        <Joistick onChange={this._handleCameraChange} top={height - 180} left={width/2}/>
      </View>
    )
  }
}

export default Feeder(Controller)
