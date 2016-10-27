/* global WebSocket */

const WEB_SOCKET_HOST = 'ws://www.crackinvoice.com/ws'

const SEND_INVOICE = '1'
const LOGIN_SUCCESS = '2'

let ws = null

function sendWSMessage (message, success) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message)
    if (typeof success === 'function') {
      success()
    }
  } else if (ws && ws.readyState === WebSocket.CONNECTING) {
    ws.onopen = () => {
      ws.send(message)
      if (typeof success === 'function') {
        success()
      }
    }
  } else {
    ws = new WebSocket(WEB_SOCKET_HOST)
    ws.onopen = () => {
      ws.send(message)
      if (typeof success === 'function') {
        success()
      }
    }
  }
}

const cIWebSocket = {
  clientId: null,
  triggerLoginSuccess: (clientId) => {
    this.clientId = clientId
    sendWSMessage(createWSMessage(LOGIN_SUCCESS, true, clientId))
  },
  sendInvoice: (invoice, success, fail) => {
    if (this.clientId) {
      sendWSMessage(createWSMessage(SEND_INVOICE, JSON.stringify(invoice), this.clientId), success)
    } else {
      if (typeof fail === 'function') {
        fail()
      }
    }
  }
}

function createWSMessage (type, value, clientId) {
  return `${type}||${value}||${clientId}`
}

export default cIWebSocket
