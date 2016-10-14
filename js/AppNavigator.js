import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Drawer } from 'native-base'
import { BackAndroid, StatusBar } from 'react-native'
import { closeDrawer } from './actions/drawer'
import { popRoute } from './actions/route'
import Navigator from 'Navigator'

import Home from './components/home'
import ScanQrCode from './components/scanQrCode'
import DisplayQrCode from './components/displayQrCode'
import CreateQrCode from './components/createQrCode'
import SplashPage from './components/splashscreen'
import SideBar from './components/sideBar'
import { statusBarColor } from './themes/base-theme'

Navigator.prototype.replaceWithAnimation = function (route) {
  const activeLength = this.state.presentedIndex + 1
  const activeStack = this.state.routeStack.slice(0, activeLength)
  const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength)
  const nextStack = activeStack.concat([route])
  const destIndex = nextStack.length - 1
  const nextSceneConfig = this.props.configureScene(route, nextStack)
  const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig])

  const replacedStack = activeStack.slice(0, activeLength - 1).concat([route])
  this._emitWillFocus(nextStack[destIndex])
  this.setState({
    routeStack: nextStack,
    sceneConfigStack: nextAnimationConfigStack
  }, () => {
    this._enableScene(destIndex)
    this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
      this.immediatelyResetRouteStack(replacedStack)
    })
  })
}

export var globalNav = {}

class AppNavigator extends Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    globalNav.navigator = this._navigator

    this.props.store.subscribe(() => {
      if (this.props.store.getState().drawer.drawerState === 'opened') {
        this.openDrawer()
      }

      if (this.props.store.getState().drawer.drawerState === 'closed') {
        this._drawer.close()
      }
    })

    BackAndroid.addEventListener('hardwareBackPress', () => {
      var routes = this._navigator.getCurrentRoutes()

      if (routes[routes.length - 1].id === 'home') {
        return false
      } else {
        this.popRoute()
        return true
      }
    })
  }

  popRoute () {
    this.props.popRoute()
  }

  openDrawer () {
    this._drawer.open()
  }

  closeDrawer () {
    if (this.props.store.getState().drawer.drawerState === 'opened') {
      this._drawer.close()
      this.props.closeDrawer()
    }
  }

  render () {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type='overlay'
        content={<SideBar navigator={this._navigator} />}
        tapToClose
        acceptPan={false}
        onClose={() => this.closeDrawer()}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        negotiatePan>
        <StatusBar backgroundColor={statusBarColor} barStyle='light-content' />
        <Navigator
          ref={(ref) => this._navigator = ref}
          configureScene={(route) => {
            return Navigator.SceneConfigs.FloatFromRight
          }}
          initialRoute={{id: 'splashscreen', statusBarHidden: true}}
          renderScene={this.renderScene} />
      </Drawer>
    )
  }

  renderScene (route, navigator) {
    switch (route.id) {
      case 'splashscreen':
        return <SplashPage navigator={navigator} />
      case 'home':
        return <Home navigator={navigator} />
      case 'scanQrCode':
        return <ScanQrCode navigator={navigator} />
      case 'createQrCode':
          return <CreateQrCode navigator={navigator} />
      case 'displayQrCode':
          return <DisplayQrCode navigator={navigator} />
      default:
        return <Home navigator={navigator} />
    }
  }
}

function bindAction (dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: () => dispatch(popRoute())
  }
}

const mapStateToProps = (state) => {
  return {
    drawerState: state.drawer.drawerState
  }
}

export default connect(mapStateToProps, bindAction)(AppNavigator)
