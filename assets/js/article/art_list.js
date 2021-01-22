$(function () {
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage;
    // 定义一个查询参数对象 将来查询文章时使用
    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//	每页显示多少条数据
        cate_id: '',//	文章分类的 Id
        state: '',//	文章的状态，可选值有：已发布、草稿
    }


    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data)
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var s = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + s + ' ' + hh + ':' + mm + ':' + ss
    }

    initTable()
    // 定义函数渲染页面
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
                // 调用分页函数
                renderPage(res.total)
            }
        });
    }

    // 初始化分类
    initCate()
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染页面
                var htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 调用layui的方法重新渲染页面
                form.render()
            }
        });
    }

    // 为筛选绑定事件
    $('#form_search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id').val()
        var state = $('[name=state]').val()
        // 赋值给q
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的q重新渲染页面
        initTable()
    })

    // 分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的ID，不用加 # 号
            count: total, //总的数据条数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认显示第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],
            // 分页发生切换时 触发jump函数
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 删除
    $('tbody').on('click', '.btn_delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if(res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    // 重新渲染页面

                    // 当前页减一 两个条件
                    // 1.当前页只有一个元素了
                    // 2.当前页码大于1
                    if ($('.btn_delete').length === 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }

                    initTable()
                }
            });

            layer.close(index);
        });
    })
})