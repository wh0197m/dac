# dac-extension
> dac的chrome插件，用来帮助用户采集用户页面上的数据。这里的技术主要是文本分析，毕竟HTML是标签文档，通过标签特征匹配，能够快速通过Javascript获取指定标签内的文本内容。

### 插件所需权限
**通过manifest配置定义了此插件所需的chrome访问权限**
* `<all_urls>`
* `tabs`
* `notifications`
* `storage`
* `unlimitedStorage`
* `downloads`

### 编包
```shell
npm run build
```
