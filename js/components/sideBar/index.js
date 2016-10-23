'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { closeDrawer } from '../../actions/drawer'
import { setIndex } from '../../actions/list'
import { replaceOrPushRoute } from '../../actions/route'
import { Content, Text, List, ListItem, Icon } from 'native-base'

import styles from './style'

class SideBar extends Component {

  navigateTo (route) {
    this.props.closeDrawer()
    this.props.setIndex(undefined)
    this.props.replaceOrPushRoute(route)
  }

  render () {
    return (
      <Content style={styles.sidebar}>
        <List foregroundColor={'white'}>
          <ListItem style={_.last(this.props.routes) === 'home' ? {backgroundColor: '#271D1D'} : {}}
            iconLeft button
            onPress={() => this.navigateTo('home')}>
            <Icon name='ios-home' />
            <Text>
              主页
            </Text>
          </ListItem>
          <ListItem style={_.last(this.props.routes) === 'scanQrCode' ? {backgroundColor: '#271D1D'} : {}}
            iconLeft button
            onPress={() => this.navigateTo('scanQrCode')}>
            <Icon name='ios-qr-scanner' />
            <Text>
              扫描二维码
            </Text>
          </ListItem>
          <ListItem style={_.last(this.props.routes) === 'displayQrCode' ? {backgroundColor: '#271D1D'} : {}}
            iconLeft button
            onPress={() => this.navigateTo('displayQrCode')}>
            <Icon name='ios-list' />
            <Text>
              显示二维码
            </Text>
          </ListItem>
          <ListItem style={_.last(this.props.routes) === 'createQrCode' ? {backgroundColor: '#271D1D'} : {}}
            iconLeft button
            onPress={() => this.navigateTo('createQrCode')}>
            <Icon name='ios-create' />
            <Text>
              生成二维码
            </Text>
          </ListItem>
        </List>
      </Content>
    )
  }
}

function mapStateToProps (state) {
  return {
    routes: state.route.routes
  }
}

const { array, func } = React.PropTypes

SideBar.propTypes = {
  routes: array.isRequired,
  closeDrawer: func.isRequired,
  setIndex: func.isRequired,
  replaceOrPushRoute: func.isRequired
}

function bindAction (dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    replaceOrPushRoute: (route) => dispatch(replaceOrPushRoute(route)),
    setIndex: (index) => dispatch(setIndex(index))
  }
}

export default connect(mapStateToProps, bindAction)(SideBar)
