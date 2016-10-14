import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openDrawer, closeDrawer } from '../../actions/drawer'
import { popRoute, pushNewRoute } from '../../actions/route'
import { Container, Header, Title, Button, Icon } from 'native-base'
import { StyleSheet, View, Dimensions } from 'react-native'
import { setIndex } from '../../actions/list'
import QRCode from 'react-native-qrcode'
import { MessageBar, MessageBarManager } from 'react-native-message-bar'
const { func, object } = React.PropTypes
const {width, height} = Dimensions.get('window')

class DisplayQrCode extends Component {
  componentDidMount () {
    MessageBarManager.registerMessageBar(this.refs.alert)
    if (!this.props.qrCode) {
      setTimeout(() => {
        this.navigateTo('home')
      }, 3000)
      MessageBarManager.showAlert({
        message: '您还没有可用的二维码，请点击生成二维码',
        alertType: 'error',
        shouldHideOnTap: true
      })
    }
  }

  componentWillUnmount () {
    MessageBarManager.unregisterMessageBar()
  }

  navigateTo (route) {
    this.props.closeDrawer()
    this.props.setIndex(undefined)
    this.props.pushNewRoute(route)
  }

  popRoute () {
    this.props.popRoute()
  }

  render () {
    const qrSize = Math.min(width, height)
    return (
      <Container>
        <Header>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='ios-arrow-back' />
          </Button>
          <Title>
            显示二维码
          </Title>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon name='ios-menu' />
          </Button>
        </Header>
        <View style={styles.container} ref='qrView'>
          <MessageBar ref='alert' />
          { this.props.qrCode ? <QRCode value={JSON.stringify(this.props.qrCode)}
            size={qrSize - 40} /> : null}
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

function bindAction (dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: () => dispatch(popRoute()),
    setIndex: (index) => dispatch(setIndex(index)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route))
  }
}

function mapStateToProps (state) {
  return {
    qrCode: state.qrCode.qrCode
  }
}

export default connect(mapStateToProps, bindAction)(DisplayQrCode)

DisplayQrCode.propTypes = {
  popRoute: func.isRequired,
  openDrawer: func.isRequired,
  pushNewRoute: func.isRequired,
  qrCode: object
}
