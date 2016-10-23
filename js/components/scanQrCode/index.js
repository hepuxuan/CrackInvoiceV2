import React, { Component } from 'react'
import { connect } from 'react-redux'

import { openDrawer } from '../../actions/drawer'
import { popRoute } from '../../actions/route'

import { Header, Title, Content, Button, Icon } from 'native-base'
import { MessageBar, MessageBarManager } from 'react-native-message-bar'
import BarcodeScanner from 'react-native-barcodescanner'
import cIWebSocket from '../../utils/webSocket'

class ScanQrCode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      torchMode: 'off',
      cameraType: 'back',
      invoice: null,
      clientId: null,
      loggedIn: false
    }
    this.handlleSendInvoice = this.handlleSendInvoice.bind(this)
    this.handleLogIn = this.handleLogIn.bind(this)
    this.barcodeReceived = this.barcodeReceived.bind(this)
  }

  componentDidMount () {
    MessageBarManager.registerMessageBar(this.refs.alert)
  }

  componentWillUnmount () {
    MessageBarManager.unregisterMessageBar()
  }

  popRoute () {
    this.props.popRoute()
  }

  handleLogIn () {
    cIWebSocket.triggerLoginSuccess(this.state.clientId)
    this.setState({
      loggedIn: true
    })
    MessageBarManager.showAlert({
      message: '登陆成功， 现在您可以通过扫描新二维码将二维码发送至网页端',
      alertType: 'success',
      shouldHideOnTap: true
    })
  }

  handlleSendInvoice () {
    const invoice = this.state.invoice
    cIWebSocket.sendInvoice(invoice, () => {
      MessageBarManager.showAlert({
        message: '发送成功， 请返回网页客户端查看',
        alertType: 'success',
        shouldHideOnTap: true
      })
    }, () => {
      MessageBarManager.showAlert({
        message: '发送失败， 请先稍后再试',
        alertType: 'error',
        shouldHideOnTap: true
      })
    })

    this.setState({
      invoice: null
    })
  }

  barcodeReceived (e) {
    let qrCode
    try {
      qrCode = JSON.parse(e.data)
    } catch (e) {
      return
    }
    if (qrCode.clientId) {
      if (qrCode.clientId !== this.state.clientId) {
        this.setState({
          clientId: qrCode.clientId,
          loggedIn: false
        })
      }
    } else {
      this.setState({
        invoice: qrCode
      })
    }
  }

  render () {
    return (
      <BarcodeScanner
        onBarCodeRead={this.barcodeReceived}
        style={{ flex: 1 }}
        torchMode={this.state.torchMode}
        cameraType={this.state.cameraType}>
        <Header>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='ios-arrow-back' />
          </Button>
          <Title>
            扫描二维码
          </Title>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon name='ios-menu' />
          </Button>
        </Header>
        <MessageBar ref='alert' />
        <Content padder>
          { this.state.invoice
            ? <Button success block bordered success
              onPress={this.handlleSendInvoice}>发送至网页</Button> : null}
          { (!this.state.loggedIn && this.state.clientId)
            ? <Button success block bordered success
              onPress={this.handleLogIn}>登录</Button> : null}

        </Content>
      </BarcodeScanner>
    )
  }
}

function bindAction (dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: () => dispatch(popRoute())
  }
}

const { func } = React.PropTypes

ScanQrCode.propTypes = {
  popRoute: func.isRequired,
  openDrawer: func.isRequired
}

export default connect(null, bindAction)(ScanQrCode)
