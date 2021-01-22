$(function () {
    var layer = layui.layer
    var form = layui.form

    // 定义渲染页面的函数
    function initForm() {
        // 定义id
        var id = location.search.split('=')[1]
        // 发送ajax请求数据
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                // 判断返回值成功与否
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 获取成功就调用form.val()方法渲染页面
                form.val('form_edit', res.data);
                // 富文本的渲染
                // 非空判断
                if (!res.data.content) {
                    layer.msg('没有编辑内容')
                }
                tinyMCE.activeEditor.setContent(res.data.content);
                // 渲染图片
                // 非空判断
                if (!res.data.cover_img) {
                    return layer.msg('没有上传封面')
                }
                var newImgURL = baseURL + res.data.cover_img
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        });
    }

    // 定义加载文章分类的方法
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始胡文章分类失败')
                }
                // 调用模板引擎 渲染页面
                var htmStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmStr)
                // 调用layui的form方法重新渲染页面
                form.render()
                // 等所有文章分类加载完毕，在渲染拿到的数据
                initForm();
                // 重新调用layui的form方法渲染
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击按钮选择图片
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click()
    })

    // 监听文件上传的change事件 
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        // 非空校验
        if (files.length === 0) {
            return;
        }
        // 不为空就生成对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        // 更换图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义问章的发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 监听表单的提交事件
    $('#form_pub').on('submit', function (e) {
        // 11.阻止默认提交行为
        e.preventDefault();
        // 2.创建formdata对象
        var fd = new FormData(this)
        // 3.把状态追加到fd中
        fd.append('state', art_state)
        console.log(...fd);
        // 4.将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件放入fd
                fd.append('cover_img', blob)
                // 6.发送ajax
                publishArticle(fd)
            })
    })

    // 定义发送ajax函数
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/edit",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改文章成功')
                // 跳转到文章列表
                window.parent.document.getElementById('atr_list').click()
            }
        });
    }
})