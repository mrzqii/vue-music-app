
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