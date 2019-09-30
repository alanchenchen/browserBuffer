const BrowserBuffer = require('../src/index')
const browserBuffer = new BrowserBuffer()

/**
 * @example 将utf8字符串下载到一个txt文件
 */
browserBuffer.writeFile({
    filename: '测试',
    data: '一段测试文本...'
})

/**
 * @example 将base64字符串下载到一个png文件，如果直接给data传base64字符串，下载下来的png图片会有问题，因为相当于只是把字符串写入了图片而不是二进制写入到图片
 */
browserBuffer
    .from('Y2hlbjEyMysr', 'base64')
    .then(data => {
        browserBuffer.writeFile({
            filename: '测试.png',
            // 因为base64字符串转成的是unit8Array类型，需要手动转成blob
            data: new Blob(data)
        })
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
