module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/covid-19/'
    : '/',
  chainWebpack: config => {
    config.module.rule('downloads')
      // bundle common document files
      .test(/\.(pdf|docx?|xlsx?|csv|pptx?)(\?.*)?$/)
      .use('file-loader')
        // use the file-loader
        .loader('file-loader')
        // bundle into the "downloads" directory
        .options({ name: 'downloads/[name].[hash:8].[ext]' })
  }
}