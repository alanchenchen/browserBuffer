const BrowserBuffer = require('../src/index')
const browserBuffer = new BrowserBuffer()

const fn = async () => {
    /**
     * @example 上传单个文件
     */
    const data1 = await browserBuffer.readFile()
    
    /**
     * @example 上传多个文件
     */
    const data2 = await browserBuffer.readFile({
        multiple: true
    })
    
    /**
     * @example 允许用户上传指定格式文件，但是不能完全限制，因为用户可以选择上传所有格式文件
     */
    const data3 = await browserBuffer.readFile({
        accept: ['image/*', '.md']
    })
    
    /**
     * @example 上传文件，获取文件的二进制数据(binary)，因为默认获取的数据为base64格式
     */
    const data4 = await browserBuffer.readFile({
        encode: 'binary'
    })
}

fn()