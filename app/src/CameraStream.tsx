import React, { Component } from 'react'
import {
  StyleSheet,
  WebView,
  RegisteredStyle,
  ViewStyle
} from 'react-native'

interface Props {
  src: string
  style?: RegisteredStyle<ViewStyle>
}

function formatHtml(src: string) {
  return `
    <html><body>
    <img src="${src}" width="100%" style="background-color: white; min-height: 100%; min-width: 100%; position: fixed; top: 0; left: 0;">
    </body></html>`
}
export default class CameraStream extends Component<Props> {
  render() {
    var styles = StyleSheet.create({
      backgroundVideo: {
        width: 400,
        height: 322,
      },
    })

    return (
        <WebView
          style={[this.props.style, styles.backgroundVideo]}
          automaticallyAdjustContentInsets={true}
          scalesPageToFit={true}
          startInLoadingState={false}
          contentInset={{ top: 0, right: 0, left: 0, bottom: 0 }}
          scrollEnabled={false}
          source={{ html: formatHtml(this.props.src), baseUrl: '/' }}
        />
    )
  }
}
