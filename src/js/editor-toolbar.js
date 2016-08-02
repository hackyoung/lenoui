var EditorToolbar = (function() {
    /**
     * 改变工具栏的条目状态
     * @param editor 编辑器对象
     * @param index	条目的索引，比如foreColor
     * @param active 是否激活该条目
     */
    var changeItemState = function(editor, index, active) {
        var $item = editor.$toolbarContainer.find('[data-id='+index+']');
        var type = $item.attr('data-type');
        if (type == 'toggle') {
            if (active) {
                $item.addClass('active');
                return;
            }
            $item.removeClass('active');
            return;
        }
        if (type == 'single-select') {
            var grp_name = $item.attr('data-group');
            $('[data-group='+grp_name+']').removeClass('active');
            if (active) {
                $item.addClass('active');
            }
            return;
        }
    };
    /**
     * 通常的工具栏条目初始化, 该方法会读取onclick，然后执行
     */
    var normalInitToolbarItem = function($item) {
        var editor = $item.data('editor');
        var func = $item.data('toolbar-item-click');
        func(editor);
        editor.focus();
    };

    var createFontSizeUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><ul class="pop-menu arrow-top"></ul></div>');
        $pop_menu_wrapper.appendTo($container);
        var $toggle = $('<span class="item" title="字体大小" data-toggle="pop-menu">16</span>');
        $toggle.popMenu().appendTo($container);
        var sizes = [10, 12, 16, 18, 24, 32, 48];
        for (var i = 0; i < sizes.length; ++i) {(function(i, item) {
            $('<li class="item" style="font-size: '+item+'px">'+item+'</li>').click(function() {
                var editor = $container.data('editor');
                var setFontSize = $container.data('toolbar-item-click');
                setFontSize(editor, i+1);
                $toggle.html(sizes[i]);
                editor.focus();
            }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        })(i, sizes[i]); }
        return $container;
    };

    var createHeadingUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><ul class="pop-menu arrow-top"></ul></div>');
        $pop_menu_wrapper.appendTo($container);
        var $toggle = $('<span class="item" title="标题" data-toggle="pop-menu">p</span>');
        $toggle.popMenu().appendTo($container);
        var sizes = [30, 26, 22, 18, 16, 12];
        for (var i = 0; i < sizes.length; ++i) {(function(i, item) {
            $('<li class="item" style="font-size: '+item+'px">h'+(i+1)+'</li>').click(function() {
                var editor = $container.data('editor');
                var setHeading = $container.data('toolbar-item-click');
                setHeading(editor, i);
                $toggle.text('h'+(i+1));
                editor.focus();
            }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        })(i, sizes[i]);}
        $('<li class="item style="font-size: 16px">p</li>').click(function() {
            var editor = $container.data('editor');
            var setHeading = $container.data('toolbar-item-click');
            setHeading(editor, 'p');
            $toggle.text('p');
            editor.focus();
        }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        return $container;
    };
    var createForeColorUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top"></div></div>');
        $pop_menu_wrapper.appendTo($container);
        var $toggle = $('<span class="zmdi zmdi-format-color-text item" title="设置前景色" data-toggle="pop-menu"></span>');
        var $cs = new ColorSelector(function(color) {
            var editor = $container.data('editor');
            var setForeColor = $container.data('toolbar-item-click');
            setForeColor(editor, color);
            editor.focus();
        }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        $toggle.popMenu().appendTo($container);
        return $container;
    };
    var createBackColorUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top"></div></div>');
        $pop_menu_wrapper.appendTo($container);
        var $toggle = $('<span class="item" data-toggle="pop-menu" title="设置背景色"><span class="back-color"></span></span>');
        var $cs = new ColorSelector(function(color) {
            var editor = $container.data('editor');
            var setBackColor = $container.data('toolbar-item-click');
            setBackColor(editor, color);
            editor.focus();
        }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        $toggle.popMenu().appendTo($container);
        return $container;
    };

    var createLinkUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top" style="min-width: 220px"></div></div>');
        $pop_menu_wrapper.appendTo($container);
        $('<div class="input-line">'+
            '<input class="input" name="link" placeholder="输入链接地址" />'+
         '</div><div class="input-line">'+   
            '<input class="input" name="link-label" placeholder="显示的文字" />'+
        '</div><div class="input-line">'+
            '<button class="btn success" style="width: 100%">插入链接</button>'+
        '</div>').click(function(e) {
            return false;
        }).appendTo($pop_menu_wrapper.find('.pop-menu')).find('.btn').click(function() {
            var editor = $container.data('editor');
            var func = $container.data('toolbar-item-click');
            func(editor, $container.find('[name=link]').val(), $container.find('[name=link-label]').val());
            editor.focus();
        });
        var $toggle = $('<span class="zmdi zmdi-link item" title="添加链接" data-toggle="pop-menu"></span>');
        $toggle.popMenu().appendTo($container);
        return $container;
    };

    var createTableUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top" style="width: 200px"></div></div>');
        $pop_menu_wrapper.appendTo($container);
        $('<div class="lr">'+
            '<input class="input" name="row" placeholder="行" style="width: 50px" />'+
            '<input class="input" name="col" placeholder="列" style="width: 50px" />'+
            '<button class="btn success">确定</button>'+
        '</div>').click(function(e) {
            return false;
        }).appendTo($pop_menu_wrapper.find('.pop-menu')).find('.btn').click(function() {
            var editor = $container.data('editor');
            var func = $container.data('toolbar-item-click');
            func(editor, $container.find('[name=row]').val(), $container.find('[name=col]').val());
            editor.focus();
        });
        var $toggle = $('<span class="zmdi zmdi-grid item" title="添加表格" data-toggle="pop-menu"></span>');
        $toggle.popMenu().appendTo($container);
        return $container;
    };

    var createCodeUI = function() {
        var toggle = $('<span></span>').addClass('zmdi zmdi-code item')
            .attr('插入代码');
        return toggle;
    };
    var toolbarItems = {
        foreColor : createForeColorUI(),
        backColor : createBackColorUI(),
        fontSize : createFontSizeUI(),
        heading : createHeadingUI(),
        link : createLinkUI(),
        table : createTableUI(),
        code : createCodeUI(),
        image : $('<span></span>').addClass('zmdi zmdi-collection-image item')
            .attr('title', '插入图片')
            .attr('for', '#editor-select-image'),
        undo : $('<span></span>').addClass('zmdi zmdi-undo item')
            .attr('title', '撤销')
            .click(function() {
                normalInitToolbarItem($(this)); 
            }
        ),
        redo: $('<span></span>').addClass("zmdi zmdi-redo item")
            .attr('title', '重做')
            .click(function() {
                normalInitToolbarItem($(this)); 
            }
        ),
        clear: $('<span></span>').addClass("zmdi zmdi-format-clear item")
            .attr('title', '清除格式')
            .click(function() {
                normalInitToolbarItem($(this)); 
            }
        ),
        alignLeft: $('<span></span>').addClass("zmdi zmdi-format-align-left item")
            .attr('title', '左对齐')
            .attr('data-type', 'single-select')
            .attr('data-group', 'align')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        alignRight: $('<span></span>').addClass("zmdi zmdi-format-align-right item")
            .attr('title', '右对齐')
            .attr('data-type', 'single-select')
            .attr('data-group', 'align')
            .click(function() {
                normalInitToolbarItem($(this)); 
            }
        ),
        alignCenter: $('<span></span>').addClass("zmdi zmdi-format-align-center item")
            .attr('title', '居中对齐')
            .attr('data-type', 'single-select')
            .attr('data-group', 'align')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        alignFull: $('<span></span>').addClass("zmdi zmdi-format-align-justify item")
            .attr('title', '两端对齐')
            .attr('data-type', 'single-select')
            .attr('data-group', 'align')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        increaseIndent: $('<span></span>').addClass("zmdi zmdi-format-indent-increase item")
            .attr('title', '增加缩进')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        decreaseIndent: $('<span></span>').addClass("zmdi zmdi-format-indent-decrease item")
            .attr('title', '减少缩进')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        underline : $('<span></span>').addClass("zmdi zmdi-format-underlined item")
            .attr('title', '下划线')
            .attr('data-type', 'toggle')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        italic : $('<span></span>').addClass("zmdi zmdi-format-italic item")
            .attr('title', '斜体字')
            .attr('data-type', 'toggle')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        bold : $('<span></span>').addClass("zmdi zmdi-format-bold item")
            .attr('title', '粗体字')
            .attr('data-type', 'toggle')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        paste : $('<span></span>').addClass("zmdi zmdi-paste item")
            .attr('title', '粘贴')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        cut : $('<span></span>').addClass("zmdi zmdi-crop item")
            .attr('title', '剪切')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        copy : $('<span></span>').addClass("zmdi zmdi-copy item")
            .attr('title', '复制')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        selectAll : $('<span></span>').addClass("zmdi zmdi-select-all item")
            .attr('title', '全选')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        orderedList : $('<span></span>').addClass("zmdi zmdi-format-list-bulleted item")
            .attr('title', '有序列表')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
        unorderedList : $('<span></span>').addClass("zmdi zmdi-format-list-numbered item")
            .attr('title', '无序列表')
            .click(function() {
                normalInitToolbarItem($(this));
            }
        ),
    };

    var toolbar = function(editor) {
        this.editor = editor;
        var $container = editor.$toolbarContainer;
        var $toolbar = $('<div class="editor-toolbar"></div>').appendTo($container);
        var toolbar_config = editor.config.toolbar;
        var func = EditorFunc.init(editor);
        for(var i = 0; i < toolbar_config.length; ++i) {
            if (toolbar_config[i] == 'sep') {
                $('<span class="sep"></span>').appendTo($toolbar);
                continue;
            }
            if (typeof func.getFunc(toolbar_config[i]) != 'function') {
                continue;
            }
            if (toolbarItems[toolbar_config[i]]) {
                var $item = toolbarItems[toolbar_config[i]];
                $item.attr('data-id', toolbar_config[i]);
                $item.ofEditor(editor).listen(func.getFunc(toolbar_config[i]));
                $item.appendTo($toolbar);
            }
        }
    };

    toolbar.prototype.update = function() {

        var doc = this.editor.getDocument();

        changeItemState(this.editor, 'bold', doc.queryCommandState('bold'));
        changeItemState(this.editor, 'italic', doc.queryCommandState('italic'));
        changeItemState(this.editor, 'underline', doc.queryCommandState('underline'));
        if (doc.queryCommandState('justifyleft')) {
            changeItemState(this.editor, 'alignLeft', true);
        } else if (doc.queryCommandState('justifyright')) {
            changeItemState(this.editor, 'alignRight', true);
        } else if (doc.queryCommandState('justifycenter')) {
            changeItemState(this.editor, 'alignCenter', true);
        } else if (doc.queryCommandState('justifyfull')) {
            changeItemState(this.editor, 'alignFull', true);
        }

        this.editor.$toolbarContainer.find('[data-id=foreColor]')
            .find('[data-toggle=pop-menu]')
            .css('color', doc.queryCommandValue('forecolor'));

        this.editor.$toolbarContainer.find('[data-id=backColor]')
            .find('[data-toggle=pop-menu]>span')
            .css('background-color', doc.queryCommandValue('backcolor'));

        // 字体大小
        var sizearray = [10,12,16,18,24,32,48];
        var sizeindex = doc.queryCommandValue('fontsize');
        if(sizeindex == '') {
            var size = 16;
        } else {
            var size = sizearray[sizeindex - 1];
        }
        this.editor.$toolbarContainer.find('[data-id=fontSize]')
            .find('[data-toggle=pop-menu]')
            .html(size);

        // 段落和头
        var formatblock = doc.queryCommandValue('formatblock');
        if(formatblock == '') {
            formatblock = 'p';
        }
        this.editor.$toolbarContainer.find('[data-id=heading]')
            .find('[data-toggle=pop-menu]')
            .html(formatblock);
    };
    toolbar.prototype.closePopMenu = function() {
        this.editor.$toolbarContainer.find('[data-toggle=pop-menu]').each(function() {
            $(this).parent().removeClass('active');
        });
    };
    return {
        items: toolbarItems,
        init: function(editor) {
            return new toolbar(editor);
        }
    };
})();
