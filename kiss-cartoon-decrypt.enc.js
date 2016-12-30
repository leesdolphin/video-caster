document.write((function () {
  const y = [94, 72, 70, 71, 86, 85, 89, 75, 82, 88, 74, 79, 66, 80, 81, 60, 87, 65, 76, 90]
  const o = []
  for (let z = 0; z < y.length; z++) {
    o[y[z]] = z + 1
  }
  const l = []
  for (let u = 0; u < arguments.length; u++) {
    const e = arguments[u].split('~')
    for (let i = e.length - 1; i >= 0; i--) {
      let v = null
      const f = e[i]
      let q = null
      let k = 0
      const s = f.length
      let m
      for (let h = 0; h < s; h++) {
        const r = f.charCodeAt(h)
        const x = o[r]
        if (x) {
          v = (x - 1) * 94 + f.charCodeAt(h + 1) - 32
          m = h
          h++
        } else if (r === 96) {
          v = 94 * (y.length - 32 + f.charCodeAt(h + 1)) + f.charCodeAt(h + 2) - 32
          m = h
          h += 2
        } else {
          continue
        }
        if (q == null) {
          q = []
        }
        if (m > k) {
          q.push(f.substring(k, m))
        }
        q.push(e[v + 1])
        k = h + 1
      }
      if (q != null) {
        if (k < s) {
          q.push(f.substring(k))
        }
        e[i] = q.join('')
      }
    }
    l.push(e[0])
  }
  let t = l.join('')
  const w = 'abcdefghijklmnopqrstuvwxyz'
  const d = [42, 10, 39, 96, 92, 126].concat(y)
  const p = String.fromCharCode(64)
  for (let z = 0; z < d.length; z++) {
    t = t.split(p + w.charAt(z)).join(String.fromCharCode(d[z]))
  }
  return t.split(p + '!').join(p)
})('^(_$_cb62=["@wrx@yl3rn@x48iafgCy","a5e8d2e9c1721ae0e84ad660c472c1f3","Cart@nS$2141#","decrypt","prototype","parse^\'hex","enc^\'ltf8","toString^\'t@s@nD@i2^\'sase64","create","Cipher@tarams","lib","C@sC","mode^\'tkcs7","pad^\'xES","","$kissenc"];!func^)(d){func^) f(){}^(a=^&0],b=^&1],c=^&2];f^%4]]^%3]]=func^)(d){^(f=null;try{^(k=^$^ 6^"b),g=^$^ 8^"a),h=^$^ 8^"c),l=C^!0]](g^%9]](^$^ 8]]),h,{keySize:4,itera^)s:1e3}),j=C^!4^#3^#2]]({ciphertext:^$^ 11^"d)}),i=C^!9]]^%3]](j,l,{mode:C^!6^#5]],iv:k,padding:C^!8^#7]]});return f=i^%9]](^$^ 8]])}catch(S){return ^&20]}},d^%21]]= new f}(window)~$_cb62[7]]^%~rypto@qS^%1~]]^%5]](~]]^%1~Crypto@qS[_~[^&~_$_cb62[~","@~var ~tion'))
