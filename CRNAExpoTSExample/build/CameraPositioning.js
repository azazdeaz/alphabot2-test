import React from 'react';
import { Gyroscope, } from 'expo';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default class GyroscopeSensor extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            gyroscopeData: { x: 0, y: 0, z: 0 },
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
            Gyroscope.setUpdateInterval(1000);
        };
        this._fast = () => {
            Gyroscope.setUpdateInterval(16);
        };
        this._subscribe = () => {
            this._subscription = Gyroscope.addListener((result) => {
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
        let { x, y, z } = this.state.gyroscopeData;
        return (React.createElement(View, { style: styles.sensor },
            React.createElement(Text, null, "Gyroscope:"),
            React.createElement(Text, null,
                "x: ",
                round(x),
                " y: ",
                round(y),
                " z: ",
                round(z)),
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
//# sourceMappingURL=CameraPositioning.js.map