import React from 'react';
const { DangerZone } = require('expo');
const { DeviceMotion } = DangerZone
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default class GyroscopeSensor extends React.Component {
	_subscription: any;
  state = {
    gyroscopeData: {
      rotation: {alpha: 0, beta: 0, gamma: 0},
      rotationRate: {alpha: 0, beta: 0, gamma: 0},
    },
  }

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    DeviceMotion.setUpdateInterval(1000);
  }

  _fast = () => {
    DeviceMotion.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = DeviceMotion.addListener((result: any) => {
      console.log(result)
      this.setState({gyroscopeData: result});
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    let r = this.state.gyroscopeData.rotation;
    let rr = this.state.gyroscopeData.rotationRate;

    return (
      <View style={styles.sensor}>
        <Text>Gyroscope:</Text>
        <Text>alpha: {round(r.alpha)} beta: {round(r.beta)} gamma: {round(r.gamma)}</Text>
        <Text>alpha: {round(rr.alpha)} beta: {round(rr.beta)} gamma: {round(rr.gamma)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function round(n: number) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
