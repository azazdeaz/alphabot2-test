import React, { Component } from 'react'
import { StyleSheet, PanResponder, View, Animated } from 'react-native'
import { PanResponderInstance } from 'react-native'
import config from './config'

const CIRCLE_RADIUS = 30
const FIELD_RADIUS = 180
const CENTER = {
  x: FIELD_RADIUS - CIRCLE_RADIUS,
  y: FIELD_RADIUS - CIRCLE_RADIUS
}

// type Props = {
//   top: number,
//   left: number,
//   onChange: ({ force: number, angle: number }) => void
// }

export default class Joistick extends Component<any> {
  panResponder: PanResponderInstance
  state = {
    pan: new Animated.ValueXY()
  }

  static defaultProps = {
    top: 0,
    left: 0,
    onChange: (x: number, y: number) => console.log(`change x: ${x} y: ${y}`)
  }

  handleChange = (_: any, event2: any) => {
    const { dx, dy } = event2
    this.props.onChange(dx, dy)
  }

  componentWillMount() {
    // Add a listener for the delta value change
    // this._val = CENTER
    // this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: this.state.pan.x, dy: this.state.pan.y }],
        // { listener: this.handleChange }
      ),
      onPanResponderRelease: () => {
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          friction: 8
        }).start()
      }
    })
    // adjusting delta value
    // this.state.pan.setValue({ x: 0, y: 0 })
  }

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    return (
      <View style={[styles.field]}>

      <View style={[styles.triangle]} />
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, styles.circle]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: config.color3,
    width: CIRCLE_RADIUS * 2,
    left: CENTER.x,
    top: CENTER.y,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS
  },
  field: {
    backgroundColor: config.color2,
    width: FIELD_RADIUS * 2,
    height: FIELD_RADIUS * 2,
    borderRadius: FIELD_RADIUS
  },
  triangle: {
    width: 0,
    height: 0,
    left: CENTER.x + 20,
    top: CENTER.y / 2,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: config.color3
  }
})
