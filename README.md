# browserBuffer

[![Build Status](https://travis-ci.com/alanchenchen/browserBuffer.svg?branch=master)](https://travis-ci.com/alanchenchen/browserBuffer)
![](https://img.shields.io/npm/v/@alanchenchen/browserbuffer.svg)
![](https://img.shields.io/npm/dt/@alanchenchen/browserbuffer.svg)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

A simple implementation for browser to switch string between buffer
> Author：Alan Chen

> Version: 0.1.1

> Date: 2019/06/05

> 浏览器端js在字符串和ArrayBuffer之间转换的插件

## Feature
* 模仿nodejs的两个api，from表示转换字符串到ArrayBuffer，toString表示转换ArrayBuffer到指定编码格式的字符串。
* 完全基于浏览器端的api，不支持nodejs。
* 自带浏览器端下载文件的功能，模拟nodejs的fs模块的writeFile。
* 封装浏览器端上传文件功能，模拟nodejs的fs模块的readFile，不需要手写input标签，局限性更低，可以通过任何方式来触发系统dialog。
* 由于ArrayBuffer、Blob以及FileReadr的使用，所以目前PC端只兼容IE10+，移动端浏览器未测试。

## Installation
* `npm install @alanchenchen/browserbuffer --save` or `yarn add @alanchenchen/browserbuffer`

## Usage
### Constructor
* 构造器无参数，必须使用new操作符生成一个实例。

### Instance Methods
1. from `[function(String | Blob | ArrayBuffer) ArrayBuffer]`，将一个字符串(或Blob对象、或ArrayBuffer)转成一个ArrayBuffer，一个参数。返回一个Promise, reslove一个ArrayBuffer
2. toString `[function(String | Blob | ArrayBuffer, Object) String]`，将一个字符串(或Blob对象、或ArrayBuffer)转成一个utf8、base64或dataURL三种格式之一的字符串，两个参数。返回一个Promise，reslove一个String。第二个参数为一个可选对象，如下：
    * encode `[String]`，可选，转换后的字符串编码格式，有utf8、base64和dataURL三种可选，默认为utf8
    * MIME `[String]`，可选，仅当编码格式为dataURL生效，决定转换后数据的文件类型，默认为text/plain，txt文本
    * charset `[String]`，可选，仅当编码格式为dataURL生效，决定转换后数据的编码类型，默认为utf8编码
3. readFile `[function(Object)]`，通过打开系统dialog读取本地文件数据，返回一个Promise，reslove文件数据，一个参数，参数是一个对象，如下：
    * accept `[Array]`，可选，允许用户上传任何类型的文件，但不能完全限制，数组项可以是MIME信息，也可以是文件后缀名，还可以是`image/*`这种，默认允许所有类型
    * multiple `[Boolean]`，是否支持多选，默认为false不支持，如果支持，可以通过键盘Shift或Control来多选
    * encode `[String]`，文件的编码格式，utf8、base64和binary字符串其中之一，默认为base64
4. writeFile `[function(Object)]`，写入数据到本地文件，返回一个Promise，一个参数，参数是一个对象，如下：
    * filename `[String]`，可选，文件名，可以带后缀名，如果带后缀名，则以后缀名为主，不带则取MIME信息。若为空，则默认为浏览器命名文件，chrome会命名为'下载'
    * dataPath `[String]`，当data为空时必选，同源的文件url路径，如果不为空，则只会下载此同源服务器路径的文件，而忽略data
    * data `[String | Object | Blob | ArrayBuffer]`，当dataPath为空时必选，写入的数据
    * MIME `[String]`，可选，仅当filename不带后缀名时生效，决定转换后数据的文件类型，默认为text/plain，txt文本。filename如果带上后缀名，则会覆盖MIME
    * charset `[String]`，可选，文件的编码格式，默认为utf8
## Example
* [buffer转换例子](./example/bufferAndString.js)
* [读取文件例子](./example/uploadFile.js)
* [下载文件例子](./example/download.js)

## Attention
1. 由于string和ArrayBuffer之间的转换依赖于FileReader，所以导致form和toString方法只能返回一个Promise，可以搭配Async函数来获取返回值。
2. 因为FileReader的存在，让浏览器端js操作buffer转码越来越方便，所以我并没有手动通过unicde值来实现(我实现了一个插件不借助FileReader来转换)。
3. 通过插件转换后的ArrayBuffer均遵循utf8编码规范，所以ASCII字符(英文字母、数字和一些符号)都只占1个字节，汉字占3个字节，这和nodejs里的buffer实现完全一致。所以前端可以直接把ArrayBuffer通过流的形式传给后台，解析起来很容易。但是需要区分的是js本身存储字符串是遵循的utf16规范。
4. 插件借助FileReader只能操作buffer转码，如果需要操作buffer内存空间数据，则只能通过TypedArray或者DataView实现，nodejs里则完全可以通过buffer模块实现，这一点区别需要注意。
5. 插件实例的所有方法均会返回Promise，所以都建议使用async函数。
6. 读取文件由于浏览器安全考虑，所以只能通过用户手动上传，所以无法直接跟nodejs的readFile一致。读取文件方法因为不需要传入input标签，所以你可以在任何时候触发，你可以手动实现各种各样的上传功能。

## license
* Anti 996(996.ICU)


