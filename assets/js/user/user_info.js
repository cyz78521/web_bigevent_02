$(function () {
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length >= 6) {
                return '昵称长度为1-6位之间!'
            }
        }
    })

    // 用户渲染
    initUserInfo()
    // 封装函数 获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('获取信息成功')
                // 渲染页面
                form.val('formUserInfo', res.data)
            }
        });
    }
    // 表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止默认行为，
        e.preventDefault()
        // 重新渲染页面
        initUserInfo()
    })

    // 4.修改用户信息
    $('.layui-form').on('submit',function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 发送ajax请求
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改用户信息成功')
                // 重新渲染页面
                window.parent.getUserInfo()
            }
        });
    })
})