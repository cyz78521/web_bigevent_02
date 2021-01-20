$(function () {
    // 获取form方法
    var form = layui.form;
    // 正则校验
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        newPwd: function (value) {
            // 判断新密码的值是否等于原密码的值
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能和原密码相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致'
            }
        }
    })
    // 修改密码
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg (res.message)
                }
                // 修改密码成功
                layui.layer.msg('修改密码成功');
                // 重置form表单
                $('.layui-form')[0].reset()
            }
        });
    })
})