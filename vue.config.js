//vue.config.js
const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
module.exports = {
	
		devServer: {
			open: true,
			disableHostCheck: true,
			overlay: {
				warnings: false,
				errors: true
			},
			https: false,
			proxy: {
				'/dev-api': {
					target: 'http://192.168.2.201:8090',
					changeOrigin: true,
					ws: false,
					pathRewrite: {
						'^/dev-api': ''
					}
				},
				// '/dev-api': {
				// 	target: 'https://dzd.sieiy.com',
				// 	changeOrigin: true,
				// 	ws: false,
				// 	pathRewrite: {
				// 		'^/dev-api': '/prod-api'
				// 	}
				// },
			},
	},
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'aliasPath']
					});
					return JSON.stringify(tfPages.routes)
				}, true )
			})
		]
	},
		// 因为 ajax 使用了 ES11 的新特性，所以需要通过项目 Babel 显式转译
	 transpileDependencies: ['ajax','@dcloudio/ui']
}