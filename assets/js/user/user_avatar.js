$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传图片
    $('#btnChooseImage').on('click', function () {
        $('#files').click();
    })
    // 为文件选择框绑定change事件
    $('#files').on('change', function (e) {
        e.preventDefault();
        var file = e.target.files[0]
        // 非空校验
        if (file.length === 0) {
            return layer.msg('请选择照片')
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 为确认按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 改为base64格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar : dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更换头像成功')
                // 重新渲染页面
                window.parent.getUserInfo()
            }
        });
    })
})