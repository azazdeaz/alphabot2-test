import React from 'react';
import WheelVelocity from './WheelVelocity'
// import CameraPositioning from './CameraPositioning2'
// import Controller from './Controller'
import { ApolloProvider } from "react-apollo";
import client from './apolloClient'

export default class App extends React.Component {
  render() {
    // return <View><Text>b0gy0r0</Text></View>
    return (
      <ApolloProvider client={client} >
        {/* <WheelVelocity />
        <CameraPositioning /> */}
        <WheelVelocity />
      </ApolloProvider>
    )
  }
}
