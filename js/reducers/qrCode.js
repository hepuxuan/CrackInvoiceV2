import { SET_QR_CODE } from '../actions/qrCode'

const initialState = {
  qrCode: {}
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_QR_CODE:
      return {
        qrCode: action.qrCode
      }
    default:
      return state
  }
}
