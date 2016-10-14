export const SET_QR_CODE = 'SET_QR_CODE'

export function setQrCode (qrCode) {
  return {
    type: SET_QR_CODE,
    qrCode
  }
}
