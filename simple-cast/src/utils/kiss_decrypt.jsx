
import CryptoJS from 'crypto-js'

export class KissDecryptor {
  constructor (
    aesInitVector = CryptoJS.enc.Hex.parse('a5e8d2e9c1721ae0e84ad660c472c1f3'),
    keyUrl = 'http://kisscartoon.me/External/RSK'
  ) {
    this.aesInitVector = aesInitVector
    this.keyPromise = window
      .fetch(keyUrl, {method: 'POST', credentials: 'include'})
      .then(function (response) {
        if (response.ok) {
          return response.text()
        } else {
          const error = new Error(response.statusText)
          error.response = response
          throw error
        }
      })
      .then(function (text) {
        return CryptoJS.SHA256(text)
      })
  }

  decrypt (encrypted) {
    return this.keyPromise.then((aesKey) => {
      const ciphertext = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(encrypted)
      })
      // Text, key, config
      const plaintext = CryptoJS.AES.decrypt(ciphertext, aesKey, {
        mode: CryptoJS.mode.CBC,
        iv: this.aesInitVector,
        padding: CryptoJS.pad.Pkcs7
      })
      return plaintext.toString(CryptoJS.enc.Utf8)
    })
  }
}
