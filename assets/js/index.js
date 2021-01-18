$(function () {
    // 1.获取信息并渲染页面
    // 调用一次 获取信息的函数,并渲染头像
    getUserInfo()
    var layer = layui.layer
    // 2.实现退出功能
    $('#btnLogout').on('click',function () {
        // 1.设置弹出框
        layer.confirm('确定要退出吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 2.清空本地存储中的token值
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
          });
    })
    
})
var layer = layui.layer
// 封装一个获取用户信息的函数
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function (res) {
            console.log(res);
            if(res.status !== 0) {
               return layer.msg('获取用户列表失败')
            }
            // 如果成功，就渲染页面
            renderAvatar(res.data)
        }
    });
}

// 封装一个渲染页面的函数
function renderAvatar(data) {
    var name = data.nickname || data.username
    // 设置欢迎文本
    $('#welcom').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染用户头像
        // 如果data的user_pic不为空值就说明该用户有头像，则优先渲染头像
    if (data.user_pic !== null) {
        // 改变头像的src属性显示用户的头像，并把整个盒子展示出来
        $('.layui-nav-img').attr('src',data.user_pic).show();
        // 隐藏文字头像
        $('.text-avatar').hide()
    }else {
        // 如果用户的头像为空 则取他的首字母或文字转换为大写并作为文字头像展示
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }
}