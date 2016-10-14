'use strict'

import React, { Component } from 'react'
import { View } from 'native-base'

export default class SplashPage extends Component {

  componentWillMount () {
    var navigator = this.props.navigator
    setTimeout(() => {
      navigator.replace({
        id: 'index'
      })
    }, 1500)
  }
  render () {
    return (
      <View />
    )
  }
}
