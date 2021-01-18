// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 拼接url地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // 统一为有权限的接口设置headers请求头信息
    if (options.url.indexOf('/my/') !== -1) {
        options.headers =
        {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 无论成功还是失败都会调用complete函数
    options.complete = function (res) {
        // 如果res.status的值为1，并且res.message的值为身份认证失败，那么说明用户没有登录，强制退出登录并清空本地存储中的token值
        if(res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 清空本地存储中的token值
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})