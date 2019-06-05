/**
 * @description 插件的入口模块。webpack的entry
 */
/**!
 * @name ApiModule
 * @author Alan chen 
 * @since 2019/05/07
 * @license 996.ICU
 */
 module.exports = class BrowserBuffer {
    constructor() {
        this._init()
        this.version = require('../package.json').version
        this.createdBy = 'alanchenchen@github.com'
    }

    /**
     * 初始化a标签创建
     * 
     * @private
     */
    _init() {
        this._downloadElement = document.createElement('a')
        this._uploadElement = document.createElement('input')
        this._uploadElement.type = 'file'
    }

    /**
     * 区分data的type，获取data的构造器名称
     * 
     * @private
     * @param {*} data 
     * @returns {String} blob、arrayBuffer、string、object或undefined其中一种
     */
    _specifyData(data) {
        if(Object.prototype.toString.call(data) == '[object Blob]') {
            return 'blob'
        }
        else if(Object.prototype.toString.call(data) == '[object ArrayBuffer]') {
            return 'arrayBuffer'
        }
        else if(typeof data == 'string') {
            return 'string'
        }
        else if(Object.prototype.toString.call(data) == '[object Object]') {
            return 'object'
        }
    }

     /**
      * 写入buffer
      * 
      * @private
      * @param {Blob} buf 必须是Blob对象 
      * @param {String} filename 文件名，可以带后缀名，如果带后缀名，则以后缀名为主，不带则取Blob对象type指定的MIME信息
      */
    async _saveBuffer(buf, filename, charset) {
        const result = await this.toString(buf, {
            encode: 'dataURL',
            MIME: buf.type,
            charset: charset
        })
        this._downloadElement.href = result
        this._downloadElement.download = filename
        this._downloadElement.click()
    }

    /**
     * 写入远程服务器文件
     * 
     * @private
     * @param {URL} path 同源的文件url路径，必须同源，否则会跳转到对应超链接而不是下载 
     * @param {String} filename 文件名，可以带后缀名，可以不带
     */
    _saveURL(path, filename) {
        this._downloadElement.href = path
        this._downloadElement.download = filename
        this._downloadElement.click()
    }

    /**
     * 通过打开系统dialog读取本地文件数据
     * 
     * @param {Object} opt
     * @param {Array} opt.accept 允许用户上传任何类型的文件，但不能完全限制，数组项可以是MIME信息，也可以是文件后缀名，还可以是image/*这种，默认允许所有类型
     * @param {Boolean} opt.multiple 是否支持多选，默认不支持，如果支持，可以通过键盘Shift或Control来多选
     * @param {String} opt.encode 文件的编码格式，utf8、base64和binary字符串其中之一，默认为base64
     * @returns {Promise} reslove一个数组，数组包含每个文件的数据对象，catch一个错误对象 
     */
    readFile({
        accept=['*'],
        multiple=false,
        encode='base64'
    } = {}) {
        this._uploadElement.accept = accept.join(',')
        this._uploadElement.multiple = multiple

        const readOneFile = (file, encode='base64') => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                let fn = null
                switch (encode) {
                    case 'utf8': 
                        fn = 'readAsText'
                        break
                    case 'base64':
                        fn = 'readAsDataURL'
                        break
                    case 'binary':
                        fn = 'readAsArrayBuffer'
                        break
                    default:
                        fn = 'readAsDataURL'
                }
                reader[fn](file)
                reader.onload = () => {
                    let result = reader.result
                    if(encode == 'base64') {
                        result = reader.result.split('base64,')[1]
                    }
                    resolve(result)
                }
                reader.onerror = () => {
                    reader.abort()
                    reject('some erros occured')
                }
            })
        }

        return new Promise((resolve, reject) => {
            this._uploadElement.onchange = async (e) => {
                let fileData = []
                let fileslist = this._uploadElement.files || e.path[0].files
                try {
                    for(let key of Object.keys(fileslist)) {
                        fileData[key] = {}
                        fileData[key].name = fileslist[key].name
                        fileData[key].type = fileslist[key].type
                        fileData[key].size = fileslist[key].size
                        fileData[key].lastModified = fileslist[key].lastModified
                        fileData[key].lastModifiedDate = fileslist[key].lastModifiedDate
                        fileData[key].data = await readOneFile(fileslist[key], encode)
                    }
                    resolve(fileData)
                } catch (error) {
                    reject(error)
                }
            }
            this._uploadElement.click()
        })
    }

    /**
     * 写入数据到本地文件
     * 
     * @param {Object} opt
     * @param {String} opt.filename 文件名，可以带后缀名，如果带后缀名，则以后缀名为主，不带则取MIME信息
     * @param {String} opt.dataPath 同源的文件url路径，如果不为空，则只会下载此同源服务器路径的文件，而忽略data
     * @param {String | Object | Blob | ArrayBuffer} opt.data 写入的数据
     * @param {String} opt.MIME 仅当filename不带后缀名时生效，决定转换后数据的文件类型，默认为text/plain，txt文本。filename如果带上后缀名，则会覆盖MIME。
     * @param {String} opt.charset 文件的编码格式，默认为utf8
     * @returns {Promise} 因为是async函数，所以返回一个promise
     */
    async writeFile({
        filename='', 
        dataPath='',
        data, 
        MIME='text/plain',
        charset='utf8'
    } = {}) {
        if(Boolean(dataPath.trim())) {
            this._saveURL(dataPath, filename)
            return
        }
        else {
            let buf
            const dataType = this._specifyData(data)
            if(dataType == 'string' || dataType == 'arrayBuffer' || dataType == 'blob') {
                buf = new Blob([data], {
                    type: MIME 
                })
            }
            else if(dataType == 'object') {
                buf = new Blob([JSON.stringify(data)], {
                    type: MIME
                })
            }
            else {
                throw new Error('data must be string or object or Blob or ArrayBuffer')
            }
            
            await this._saveBuffer(buf, filename, charset)
        }
    }

    /**
     * 将一个字符串(或Blob对象、或ArrayBuffer)转成一个ArrayBuffer
     * 
     * @param {String | Blob | ArrayBuffer} data 需要转换的数据
     * @returns {Promise} reslove一个ArrayBuffer，catch一个错误对象
     */
    from(data) {
        try {
            const blobData = new Blob([data])
            return new Promise((resolve, reject) => {
                const file = new FileReader()
                file.readAsArrayBuffer(blobData)
                file.onload = () => {
                    resolve(file.result)
                }
                file.onerror = () => {
                    file.abort()
                    reject('some erros occured')
                }
            })

        } catch (error) {
            throw new Error(`data must be string or object or Blob or ArrayBuffer, ${error}`)
        }
    }

    /**
     * 将一个字符串(或Blob对象、或ArrayBuffer)转成一个utf8、base64或dataURL三种格式之一的字符串
     * 
     * @param {String | Blob | ArrayBuffer} data 需要转换的数据 
     * @param {Object} opt
     * @param {String} opt.encode 转换后的字符串编码格式，有utf8、base64和dataURL三种可选，默认为utf8
     * @param {String} opt.MIME 仅当编码格式为dataURL生效，决定转换后数据的文件类型，默认为text/plain，txt文本
     * @param {String} opt.charset 仅当编码格式为dataURL生效，决定转换后数据的编码类型，默认为utf8编码
     * @returns {Promise} reslove一个根据编码格式返回纯字符串或base64字符串或带dataURL的base64字符串，catch一个错误对象 
     */
    toString(data, {encode='utf8', MIME='text/plain', charset='utf8'} = {}) {
        try {
            const blobData = new Blob([data], {type: MIME})
            let fn = null

            switch (encode) {
                case 'utf8': 
                    fn = 'readAsText'
                    break
                case 'base64':
                    fn = 'readAsDataURL'
                    break
                case 'dataURL':
                    fn = 'readAsDataURL'
                    break
                default:
                    fn = 'readAsText'
            }

            return new Promise((resolve, reject) => {
                const file = new FileReader()
                file[fn](blobData)
                file.onload = () => {
                    if(encode == 'utf8') {
                        resolve(file.result)
                    }
                    else {
                        let result = file.result.split(';').join(`;charset=${charset};`)
                        if(encode == 'base64') {
                            result = result.split('base64,')[1]
                        }
                        resolve(result)
                    }
                }
                file.onerror = () => {
                    file.abort()
                    reject('some erros occured')
                }
            })
        } catch(error) {
            throw new Error(`data must be string or object or Blob or ArrayBuffer, ${error}`)
        }
        
    }
}