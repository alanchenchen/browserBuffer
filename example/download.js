const BrowserBuffer = require('../src/index')
const browserBuffer = new BrowserBuffer()

/**
 * @example 将字符串下载到一个txt文件
 */
browserBuffer.writeFile({
    filename: '测试',
    data: '一段测试文本...'
})

/**
 * @example 将对象下载到一个json文件
 */
browserBuffer.writeFile({
    filename: '测试',
    data: {name: 'alan', age: 24},
    MIME: 'application/json',
    charset: 'utf8'
})

/**
 * @example 将对象下载到一个json文件, 如果需要更改存储的文件格式，除了手动书写MIME以外，还可以在filename带上后缀名
 */
browserBuffer.writeFile({
    filename: '测试.json',
    data: {name: 'alan', age: 24},
    charset: 'utf8'
})

/**
 * @example 下载到一个同源服务器的文件，必须保证文件在同一个服务器上
 */
browserBuffer.writeFile({
    filename: '测试.txt', // 如果不填，名字会取服务器的文件名
    dataPath: '/static/test.txt',
})