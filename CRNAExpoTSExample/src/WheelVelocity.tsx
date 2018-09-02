import React from 'react'
const Slider = require('react-native-slider')
import { StyleSheet, View, Text, Button } from 'react-native'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import pDebounce from 'p-debounce'

const SET_WHEEL_SPEED = gql`
  mutation SetWheelSpeed($left: Float, $right: Float) {
    setMotor(left: $left, right: $right) {
      ok
    }
  }
`

export default class WheelVelocity extends React.Component {
  state = {
    speed: 0,
    steer: 0,
    camPitch: 0,
    camYaw: 0,
  }

  setMotors = pDebounce(async (mutation: Function) => {
    const { speed, steer } = this.state
    const lrRatio = (steer + 1) / 2
    const scaleUp = 100
    const left = speed * lrRatio * scaleUp
    const right = speed * ( 1-lrRatio) * scaleUp
    console.log({ left, right })
    try {
      await mutation({
        variables: { left, right },
      })
    } catch (error) {
      console.error(error)
    }
  }, 60)

  render() {
    // return <View style={styles.container}><Text>b0gy0r0</Text></View>
    return (
      <Mutation mutation={SET_WHEEL_SPEED}>
        {setMotors => {
          return (
            <View style={styles.container}>
              <Slider.default
                value={this.state.speed}
                minimumValue={-1}
                maximumValue={1}
                onValueChange={(speed: number) => {
                  this.setState({ speed }, () => this.setMotors(setMotors))
                }}
              />
              <Text>speed: {this.state.speed.toString()}</Text>
              <Slider.default
                value={this.state.steer}
                minimumValue={-1}
                maximumValue={1}
                onValueChange={(steer: number) => {
                  this.setState({ steer }, () => this.setMotors(setMotors))
                }}
              />
              <Text>steer: {this.state.steer.toString()}</Text>
              <Button
                onPress={() => {
                  this.setState({ steer: 0, speed: 0 }, () => this.setMotors(setMotors))
                }}
                title="Stop"
                color="#841584"
              />
            </View>
          )
        }}
      </Mutation>
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
