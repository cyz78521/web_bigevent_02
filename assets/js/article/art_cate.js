$(function () {
    var form = layui.form
    var layer = layui.layer
    //初始化文章列表
    initArtCateList()
    function initArtCateList() {
        //    发送ajax获取文章列表 
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // 渲染页面
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
            }
        });
    }
    // 给添加类别绑定点击事件
    // 弹框创建和删除不在同一域 涉及到跨域，所以必须设置为全局变量
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        });

    })

    // 提交添加分类
    // 用事件委托绑定submit事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                // 判断状态码
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 弹出提示
                layer.msg('添加文章列表成功')
                // 刷新列表
                initArtCateList()
                // 关闭弹框
                layer.close(indexAdd)
            }
        });
    })


    // 显示修改form表单
    var indexEdit = null;
    $('tbody').on('click', '.btn_edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        });

        // 获取点击的索引id值
        var id = $(this).attr('data-id');
        // 发送ajax
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染页面
                form.val('form_edit', res.data)
            }
        });
    })

    // 渲染修改后的文本
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新数据分类成功');
                // 重新渲染页面
                initArtCateList()
                // 关闭弹出层
                layer.close(indexEdit)
            }
        });
    })

    // 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn_delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    initArtCateList()
                    layer.close(index);
                }
            });
        });
    })
})