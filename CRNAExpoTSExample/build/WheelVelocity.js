var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
const Slider = require('react-native-slider');
import { StyleSheet, View, Text, Button } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import pDebounce from 'p-debounce';
import { compose } from 'recompose';
const SET_WHEEL_SPEED = gql `
  mutation SetWheelSpeed($left: Float, $right: Float) {
    setMotor(left: $left, right: $right) {
      ok
    }
  }
`;
const MOVE_CAMERA = gql `
  mutation SetWheelSpeed($channel: Int, $pulse: Int) {
    look(channel: $channel, pulse: $pulse) {
      ok
    }
  }
`;
const Feeder = compose(graphql(SET_WHEEL_SPEED, { name: 'setMotors' }), graphql(MOVE_CAMERA, { name: 'setCamera' }));
class WheelVelocity extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            speed: 0,
            steer: 0,
            camPitch: 0,
            camYaw: 0,
        };
        this.setMotors = pDebounce(() => __awaiter(this, void 0, void 0, function* () {
            const { speed, steer } = this.state;
            const lrRatio = (steer + 1) / 2;
            const scaleUp = 100;
            const left = speed * lrRatio * scaleUp;
            const right = speed * (1 - lrRatio) * scaleUp;
            console.log({ left, right });
            try {
                yield this.props.setMotors({
                    variables: { left, right },
                });
            }
            catch (error) {
                console.error(error);
            }
        }), 60);
        this.setCamera = pDebounce((channel, value) => {
            this.setState({
                [channel === 0 ? 'camYaw' : 'camPitch']: value
            });
            const pulse = parseInt(1500 + 1000 * value);
            this.props.setCamera({
                variables: { channel, pulse }
            });
        }, 60);
    }
    render() {
        // return <View style={styles.container}><Text>b0gy0r0</Text></View>
        return (React.createElement(View, { style: styles.container },
            React.createElement(Slider.default, { value: this.state.speed, minimumValue: -1, maximumValue: 1, onValueChange: (speed) => {
                    this.setState({ speed }, () => this.setMotors());
                } }),
            React.createElement(Text, null,
                "speed: ",
                this.state.speed.toString()),
            React.createElement(Slider.default, { value: this.state.steer, minimumValue: -1, maximumValue: 1, onValueChange: (steer) => {
                    this.setState({ steer }, () => this.setMotors());
                } }),
            React.createElement(Text, null,
                "steer: ",
                this.state.steer.toString()),
            React.createElement(Button, { onPress: () => {
                    this.setState({ steer: 0, speed: 0 }, () => this.setMotors());
                }, title: "Stop", color: "#841584" }),
            React.createElement(Slider.default, { value: this.state.camYaw, minimumValue: -1, maximumValue: 1, onValueChange: (value) => this.setCamera(0, value) }),
            React.createElement(Text, null,
                "camera yaw: ",
                this.state.camYaw.toString()),
            React.createElement(Slider.default, { value: this.state.camPitch, minimumValue: -1, maximumValue: 1, onValueChange: (value) => this.setCamera(1, value) }),
            React.createElement(Text, null,
                "camera pitch: ",
                this.state.camPitch.toString())));
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
});
export default Feeder(WheelVelocity);
//# sourceMappingURL=WheelVelocity.js.map