import React from 'react';
const { DangerZone } = require('expo');
const { DeviceMotion } = DangerZone;
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default class GyroscopeSensor extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            gyroscopeData: {
                rotation: { alpha: 0, beta: 0, gamma: 0 },
                rotationRate: { alpha: 0, beta: 0, gamma: 0 },
            },
        };
        this._toggle = () => {
            if (this._subscription) {
                this._unsubscribe();
            }
            else {
                this._subscribe();
            }
        };
        this._slow = () => {
            DeviceMotion.setUpdateInterval(1000);
        };
        this._fast = () => {
            DeviceMotion.setUpdateInterval(16);
        };
        this._subscribe = () => {
            this._subscription = DeviceMotion.addListener((result) => {
                console.log(result);
                this.setState({ gyroscopeData: result });
            });
        };
        this._unsubscribe = () => {
            this._subscription && this._subscription.remove();
            this._subscription = null;
        };
    }
    componentDidMount() {
        this._toggle();
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    render() {
        let r = this.state.gyroscopeData.rotation;
        let rr = this.state.gyroscopeData.rotationRate;
        return (React.createElement(View, { style: styles.sensor },
            React.createElement(Text, null, "Gyroscope:"),
            React.createElement(Text, null,
                "alpha: ",
                round(r.alpha),
                " beta: ",
                round(r.beta),
                " gamma: ",
                round(r.gamma)),
            React.createElement(Text, null,
                "alpha: ",
                round(rr.alpha),
                " beta: ",
                round(rr.beta),
                " gamma: ",
                round(rr.gamma)),
            React.createElement(View, { style: styles.buttonContainer },
                React.createElement(TouchableOpacity, { onPress: this._toggle, style: styles.button },
                    React.createElement(Text, null, "Toggle")),
                React.createElement(TouchableOpacity, { onPress: this._slow, style: [styles.button, styles.middleButton] },
                    React.createElement(Text, null, "Slow")),
                React.createElement(TouchableOpacity, { onPress: this._fast, style: styles.button },
                    React.createElement(Text, null, "Fast")))));
    }
}
function round(n) {
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
//# sourceMappingURL=CameraPositioning2.js.map