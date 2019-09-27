const BrowserBuffer = require('../src/index')
const browserBuffer = new BrowserBuffer()

const fn = async () => {
    /**
     * @example 将utf8字符串转成ArrayBuffer
     */
    const buf = await browserBuffer.from('测试文字2333测试数字=--测试符号')

    /**
     * @example 将base64字符串转成ArrayBuffer
     */
    const buf_1 = await browserBuffer.from('Y2hlbjEyMysr', 'base64')

    /**
     * @example 将ArrayBuffer转成纯文本
     */
    const pureStr = await browserBuffer.toString(buf)

    /**
     * @example 将ArrayBuffer转成base64字符串
     */
    const base64Str = await browserBuffer.toString(buf, {
        encode: 'base64'
    })

    /**
     * @example 将ArrayBuffer转成dataURL字符串
     */
    const dataURLStr = await browserBuffer.toString(buf, {
        encode: 'dataURL',
        MIME: 'text/plain'
    })
}

fn()