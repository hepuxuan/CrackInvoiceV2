import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openDrawer } from '../../actions/drawer'
import { popRoute, replaceOrPushRoute } from '../../actions/route'
import { Container, Header, Title, Content, List, ListItem, InputGroup, Input, Button, Icon } from 'native-base'
import store from 'react-native-simple-store'
import { MessageBar, MessageBarManager } from 'react-native-message-bar'
import { setQrCode } from '../../actions/qrCode'
const { func } = React.PropTypes

class CreateQrCode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      invoice: {},
      showAlert: false
    }

    this.handleSaveQrCode = this.handleSaveQrCode.bind(this)
  }

  componentDidMount () {
    MessageBarManager.registerMessageBar(this.refs.alert)
  }

  componentWillUnmount () {
    MessageBarManager.unregisterMessageBar()
  }

  updateState (key, value) {
    const newInvoice = {}
    newInvoice[key] = value
    this.setState({
      invoice: {
        ...this.state.invoice,
        ...newInvoice
      }
    })
  }

  popRoute () {
    this.props.popRoute()
  }

  handleSaveQrCode () {
    this.props.setQrCode(this.state.invoice)
    this.setState({
      showAlert: true
    })
    store.save('qrCode', this.state.invoice).then(() => {
      MessageBarManager.showAlert({
        message: '保存成功， 即将返回主页',
        alertType: 'success',
        shouldHideOnTap: true,
        viewTopOffset: 0
      })
      setTimeout(() => {
        this.props.replaceOrPushRoute('index')
      }, 3000)
    }).catch(() => {
      MessageBarManager.showAlert({
        message: '保存失败， 请稍后再试',
        alertType: 'error',
        shouldHideOnTap: true,
        viewTopOffset: 0
      })
    })
  }

  render () {
    return (
      <Container>
        <Header>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='ios-arrow-back' />
          </Button>
          <Title>
            生成二维码
          </Title>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon name='ios-menu' />
          </Button>
        </Header>
        <Content padder>
          <MessageBar ref='alert' />
          <List style={{marginTop: this.state.showAlert ? 50 : 0}}>
            <ListItem>
              <InputGroup>
                <Input
                  stackedLabel label='公司名称：'
                  text={this.state.invoice.companyName}
                  onChangeText={(text) => { this.updateState('companyName', text) }}
                />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  stackedLabel label='纳税人识别号：'
                  text={this.state.invoice.taxPayerNumber}
                  keyboardType='numeric'
                  onChangeText={(text) => { this.updateState('taxPayerNumber', text) }}
                />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  stackedLabel label='地址：'
                  text={this.state.invoice.address}
                  onChangeText={(text) => { this.updateState('address', text) }}
                />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  stackedLabel label='电话：'
                  text={this.state.invoice.phone}
                  keyboardType='numeric'
                  onChangeText={(text) => { this.updateState('phone', text) }}
                />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  stackedLabel label='开户银行：'
                  text={this.state.invoice.bankName}
                  onChangeText={(text) => { this.updateState('bankName', text) }}
                />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  stackedLabel label='开户银行账号：'
                  text={this.state.invoice.bankAccount}
                  keyboardType='numeric'
                  onChangeText={(text) => { this.updateState('bankAccount', text) }}
                />
              </InputGroup>
            </ListItem>
          </List>

          <Button style={{marginTop: 30}} success block onPress={this.handleSaveQrCode}> 保存 </Button>
        </Content>
      </Container>
    )
  }
}

function bindAction (dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: () => dispatch(popRoute()),
    replaceOrPushRoute: (route) => dispatch(replaceOrPushRoute(route)),
    setQrCode: (qrCode) => dispatch(setQrCode(qrCode))
  }
}

export default connect(null, bindAction)(CreateQrCode)

CreateQrCode.propTypes = {
  popRoute: func.isRequired,
  openDrawer: func.isRequired,
  replaceOrPushRoute: func.isRequired,
  setQrCode: func.isRequired
}
