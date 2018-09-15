import React, { Component } from 'react'
import {
  StyleSheet,
  PanResponder,
  View,
  Animated,
  PanResponderInstance,
  RegisteredStyle,
  ViewStyle,
} from 'react-native'
import config from './config'

export interface PullEvent {
  force: number
  radian: number
}

interface Props {
  radius: number
  knobRadius: number
  pullBack: boolean
  onChange: ({ force, radian }: PullEvent) => void
  style?: RegisteredStyle<ViewStyle>
}

interface Position {
  x: number
  y: number
}

export default class Joistick extends Component<Props> {
  panResponder: PanResponderInstance
  onTouchStartPosition: Position
  latestPosition: Position
  state = {
    pan: new Animated.ValueXY({ x: 0, y: 0 }),
  }

  static defaultProps: Props = {
    radius: 150,
    knobRadius: 30,
    pullBack: false,
    onChange: ({ force, radian }) =>
      console.log(`change force: ${force} radian: ${radian}`),
  }

  componentWillMount() {
    // Add a listener for the delta value change
    // this._val = CENTER
    // this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.onTouchStartPosition = this.latestPosition || { x: 0, y: 0 }
      },
      onPanResponderMove: (_, gestureState) => {
        const { radius, pullBack } = this.props
        const { dx, dy } = gestureState
        let distance = Math.sqrt(dx ** 2 + dy ** 2)
        distance = Math.min(radius, distance)
        const radian = Math.atan2(dy, dx)
        let x = Math.cos(radian) * distance
        let y = Math.sin(radian) * distance
        if (!pullBack) {
          x += this.onTouchStartPosition.x
          y += this.onTouchStartPosition.y
        }
        this.latestPosition = { x, y }

        this.state.pan.x.setValue(x)
        this.state.pan.y.setValue(y)
        const force = distance / radius
        this.props.onChange({ force, radian })
      },
      onPanResponderRelease: () => {
        if (this.props.pullBack) {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 8,
          }).start()
  
          this.props.onChange({ force: 0, radian: 0 })
        }
      },
    })
    // adjusting delta value
    // this.state.pan.setValue({ x: 0, y: 0 })
  }

  render() {
    const { radius, knobRadius } = this.props
    const center = radius - knobRadius
    const ds = {
      field: {
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
      },
      circle: {
        transform: this.state.pan.getTranslateTransform(),
        left: center,
        top: center,
        width: knobRadius * 2,
        height: knobRadius * 2,
        borderRadius: knobRadius,
      },
      triangle: {
        left: center + 20,
        top: center / 2,
      }
    }
    return (
      <View style={[this.props.style, ds.field, styles.field]}>
        <View style={[ds.triangle, styles.triangle]} />
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[ds.circle, styles.circle]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    backgroundColor: config.color3,
  },
  field: {
    position: 'absolute',
    backgroundColor: config.color2,
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: config.color3,
  },
})
