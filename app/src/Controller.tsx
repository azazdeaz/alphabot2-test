import React, { Component } from 'react'
import Joistick, { PullEvent } from './Joistick'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import gql from 'graphql-tag'
import throttle from 'lodash/throttle'
import { Dimensions, View, StyleSheet } from 'react-native'
import CameraStream from './CameraStream'

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

const CIRCLE_RADIUS = 30
const JOISTICK_RADIUS = 150

const Feeder = compose(
  graphql(SET_WHEEL_SPEED, { name: 'setMotors' }),
  graphql(MOVE_CAMERA, { name: 'setCamera' })
)

interface Props {
  setMotors: Function
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
    const vertical = scale(Math.sin(radian))
    const horisontal = scale(-Math.cos(radian))
    console.log({ vertical, horisontal })
    this.props.setCamera({ variables: { channel: 0, pulse: horisontal } })
    this.props.setCamera({ variables: { channel: 1, pulse: vertical } })
  }
  render() {
    const { width, height } = Dimensions.get('window')
    
    const styles = StyleSheet.create({
      stream: {
        position: 'absolute',
        left: 0,
        top: 0,
      },
      motorJoistick: {
        position: 'absolute',
        left: width / 2 - JOISTICK_RADIUS,
        top: height - JOISTICK_RADIUS * 2,
      },
      cameraJoistick: {
        position: 'absolute',
        left: width / 2 - JOISTICK_RADIUS,
        top: 0,
        opacity: 0.2,
      },
    })

    return (
      <View>
        <CameraStream src="http://192.168.0.32:8080/?action=stream" style={styles.stream} />
        <Joistick
          radius={JOISTICK_RADIUS}
          knobRadius={CIRCLE_RADIUS}
          onChange={this._handleMotorChange}
          style={styles.motorJoistick}
          pullBack
          />
        <Joistick
          onChange={this._handleCameraChange}
          style={styles.cameraJoistick}
          radius={JOISTICK_RADIUS}
          knobRadius={CIRCLE_RADIUS}
        />
      </View>
    )
  }
}

export default Feeder(Controller)
