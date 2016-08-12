
import CryptoJS from 'crypto-js'

export class KissDecryptor {
  constructor (
    aesInitVector = CryptoJS.enc.Hex.parse('a5e8d2e9c1721ae0e84ad660c472c1f3'),
    keyPasswd = 'WrxLl3rnA48iafgCy',
    keySalt = CryptoJS.enc.Utf8.parse('CartKS$2141#')
  ) {
    this.aesInitVector = aesInitVector
    this.keyPasswd = keyPasswd
    this.keySalt = keySalt
  }

  decrypt (encrypted) {
    const aesKey = CryptoJS.PBKDF2(this.keyPasswd, this.keySalt, {
      keySize: 4,
      iterations: 1e3
    })
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
  }
}
