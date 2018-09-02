import React from 'react'
const Slider = require('react-native-slider')
import { StyleSheet, View, Text, Button } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import pDebounce from 'p-debounce'
import { compose } from 'recompose'

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
  graphql(SET_WHEEL_SPEED, { name: 'setMotors' },),
  graphql(MOVE_CAMERA, { name: 'setCamera' },)
)

class WheelVelocity extends React.Component {
  state = {
    speed: 0,
    steer: 0,
    camPitch: 0,
    camYaw: 0,
  }

  setMotors = pDebounce(async () => {
    const { speed, steer } = this.state
    const lrRatio = (steer + 1) / 2
    const scaleUp = 100
    const left = speed * lrRatio * scaleUp
    const right = speed * ( 1-lrRatio) * scaleUp
    console.log({ left, right })
    try {
      await this.props.setMotors({
        variables: { left, right },
      })
    } catch (error) {
      console.error(error)
    }
  }, 60)

  setCamera = pDebounce((channel: number, value:number) => {
    this.setState({
      [channel === 0 ? 'camYaw' : 'camPitch']: value
    })
    const pulse = parseInt(1500 + 1000 * value)
    this.props.setCamera({
      variables: { channel, pulse }
    })
  }, 60)

  render() {
    // return <View style={styles.container}><Text>b0gy0r0</Text></View>
    return (
            <View style={styles.container}>
              <Slider.default
                value={this.state.speed}
                minimumValue={-1}
                maximumValue={1}
                onValueChange={(speed: number) => {
                  this.setState({ speed }, () => this.setMotors())
                }}
              />
              <Text>speed: {this.state.speed.toString()}</Text>
              <Slider.default
                value={this.state.steer}
                minimumValue={-1}
                maximumValue={1}
                onValueChange={(steer: number) => {
                  this.setState({ steer }, () => this.setMotors())
                }}
              />
              <Text>steer: {this.state.steer.toString()}</Text>
              <Button
                onPress={() => {
                  this.setState({ steer: 0, speed: 0 }, () => this.setMotors())
                }}
                title="Stop"
                color="#841584"
              />
              <Slider.default
                value={this.state.camYaw}
                minimumValue={-1}
                maximumValue={1}
                onValueChange={(value: number) => this.setCamera(0, value)}
              />
              <Text>camera yaw: {this.state.camYaw.toString()}</Text>
              <Slider.default
                value={this.state.camPitch}
                minimumValue={-1}
                maximumValue={1}
                onValueChange={(value: number) => this.setCamera(1, value)}
              />
              <Text>camera pitch: {this.state.camPitch.toString()}</Text>
            </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
})

export default Feeder(WheelVelocity)
