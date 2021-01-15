$(function () {
    // 给登录div里面的a链接添加点击事件 点击以后登录盒子隐藏，注册盒子显示
    $('#link_reg').on('click',function () {
        $('.login_box').hide();
        $('.reg_box').show()
    });
    $('#link_login').on('click',function () {
        $('.login_box').show();
        $('.reg_box').hide()
    })

    // 2.自定义校验规则
    // 只要调用了layui.all.js 就会产生新的对象 叫layui.form
    var form = layui.form
    form.verify({
        pwd : [
            // 数组第一项为要验证的正则表达式
            /^[\S]{6,12}$/,
            // 数组第二项为要提示的错误信息
            '密码必须6到12位，且不能出现空格'
        ],
        repwd : function (value) {
            // 拿到密码框里面的值
            var pwd = $('.reg_box [name=password]').val().trim();
            // 判断两次输入的值是否相等，不相等就返回错误提示，相等就直接通过
            if(pwd !== value) {
                return '两次密码不一致'
            }
        }
    })
    
    // 3.注册模块的实现
    $('#form_reg').on('submit',function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        var layer = layui.layer
        var data =  {
            username : $('#form_reg [name=username]').val(),
            password : $('#form_reg [name=password]').val()
        }
        // 发送ajax请求
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: data,
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                // 注册成功以后调用点击事件 跳转到登录页面
                $('#link_login').click();
                // 快速把表单里面的值清空
                $('#form_reg')[0].reset()
            }
        });
    })

    // 4.登录模块实现
    $('#form_login').submit(function (e) {
        e.preventDefault();
        var layer = layui.layer
        // 发送ajax请求
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                // 登陆成功以后将token值 存到本地存储
                localStorage.setItem('token',res.token);
                // 跳转到首页
                location.href = '/index.html'
            }
        });
    })
})