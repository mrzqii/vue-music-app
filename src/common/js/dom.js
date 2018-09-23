
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    // 返回一个 Boolean 值，它指出在被查找的字符串中是否匹配给出的正则表达式。 
    return reg.test(el.className)
  }
  
  export function addClass(el, className) {
    if (hasClass(el, className)) {
      return
    }
    // 对类名的拼装
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }

  export function getData(el, name, val) {
    const prefix = 'data-'
    if(val) {
      return el.setAttribute(prefix + name, val)
    }
    return el.getAttribute(prefix + name)
  }

  // 判断浏览器对css3属性的支持情况
  let elementStyle = document.createElement('div').style
  let vendor = (() => {
    let transformNames = {
      webkit: 'webkitTransform',
      Moz: 'MozTransform',
      O: 'OTransform',
      ms: 'msTransform',
      standard: 'transform'
    }
  
    for (let key in transformNames) {
      if (elementStyle[transformNames[key]] !== undefined) {
        return key
      }
    }
    // 如果都支持说明出现了问题，哪里有浏览器对每个前缀都支持的
    return false
  })()

  export function prefixStyle(style) {
    if (vendor === false) {
      return false
    }
  
    if (vendor === 'standard') {
      return style
    }
  //拼成这样子： webkitTransform
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
  }