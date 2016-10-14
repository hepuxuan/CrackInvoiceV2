import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from 'react-native-simple-store'
import { setQrCode } from '../../actions/qrCode'
import { openDrawer, closeDrawer } from '../../actions/drawer'
import { setIndex } from '../../actions/list'
import { replaceRoute, pushNewRoute } from '../../actions/route'
import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem } from 'native-base'

// import myTheme from '../../themes/base-theme'

class Home extends Component {
  replaceRoute (route) {
    this.props.replaceRoute(route)
  }

  componentDidMount () {
    store.get('qrCode').then((qrCode) => {
      this.props.setQrCode(qrCode)
    })
  }

  navigateTo (route) {
    this.props.closeDrawer()
    this.props.setIndex(undefined)
    this.props.pushNewRoute(route)
  }

  render () {
    return (
      <Container>
        <Header>
          <Title>
            {(this.props.name) ? this.props.name : '主页'}
          </Title>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon name='ios-menu' />
          </Button>
        </Header>
        <Content>
          <List>
            <ListItem iconLeft button onPress={() => this.navigateTo('scanQrCode')}>
              <Icon name='ios-qr-scanner' />
              <Text>
                扫描二维码
              </Text>
            </ListItem>
            <ListItem iconLeft button onPress={() => this.navigateTo('displayQrCode')}>
              <Icon name='ios-list' />
              <Text>
                显示二维码
              </Text>
            </ListItem>
            <ListItem iconLeft button onPress={() => this.navigateTo('createQrCode')}>
              <Icon name='ios-create' />
              <Text>
                生成二维码
              </Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}

function bindAction (dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
    replaceRoute: (route) => dispatch(replaceRoute(route)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    setIndex: (index) => dispatch(setIndex(index)),
    setQrCode: (qrCode) => dispatch(setQrCode(qrCode))
  }
}

function mapStateToProps (state) {
  return {
    name: state.user.name,
    list: state.list.list,
    qrCode: state.qrCode.qrCode
  }
}

const { func, object, string } = React.PropTypes

Home.propTypes = {
  replaceRoute: func.isRequired,
  setQrCode: func.isRequired,
  qrCode: object,
  closeDrawer: func.isRequired,
  setIndex: func.isRequired,
  pushNewRoute: func.isRequired,
  name: string,
  openDrawer: func.isRequired
}

export default connect(mapStateToProps, bindAction)(Home)
