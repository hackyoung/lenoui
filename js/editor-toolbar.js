var EditorToolbar = (function() {

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
    }

    var normalInitToolbarItem = function($item) {
        var editor = $item.data('editor');
        var func = $item.data('toolbar-item-click');
        var type = $item.attr('data-type');
        if (type == 'toggle') {
            if ($item.hasClass('active')) {
                $item.removeClass('active');
            } else {
                $item.addClass('active');
            }
        } else if (type == 'single-select') {
            var grp_name = $item.attr('data-group');
            $('[data-group='+grp_name+']').removeClass('active');
            $item.addClass('active');
        }
        func(editor);
        editor.focus();
    };

    var getFontSizeUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><ul class="pop-menu arrow-top"></ul></div>');
        $pop_menu_wrapper.appendTo($container);
        var $toggle = $('<span class="item" data-toggle="pop-menu">16</span>');
        $toggle.popMenu().appendTo($container);
        var sizes = [10, 12, 16, 18, 24, 32, 48];
        for (var i = 0; i < sizes.length; ++i) {
            $('<li class="item" style="font-size: '+sizes[i]+'px">'+sizes[i]+'</li>').click(function() {
                var editor = $container.data('editor');
                var setFontSize = $container.data('toolbar-item-click');
                setFontSize(editor, sizes[i]);
                $toggle.html(sizes[i]);
            }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        }
        return $container;
    };

    var getHeadingUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><ul class="pop-menu arrow-top"></ul></div>');
        $pop_menu_wrapper.appendTo($container);
        var $toggle = $('<span class="item" data-toggle="pop-menu">p</span>');
        $toggle.popMenu().appendTo($container);
        var sizes = [30, 26, 22, 18, 16, 12];
        for (var i = 0; i < sizes.length; ++i) {(function(i, item) {
            $('<li class="item" style="font-size: '+item+'px">h'+i+'</li>').click(function() {
                var editor = $container.data('editor');
                var setHeading = $container.data('toolbar-item-click');
                setHeading(editor, i);
                $toggle.text('h'+i);
            }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        })(i, sizes[i]);}
        $('<li class="item style="font-size: 16px">p</li>').click(function() {
            var editor = $container.data('editor');
            var setHeading = $container.data('toolbar-item-click');
            setHeading(editor, 'p');
            $toggle.text('p');
        }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        return $container;
    };

    var getForeColorUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top"></div></div>');
        $pop_menu_wrapper.appendTo($container);
        var $toggle = $('<span class="zmdi zmdi-format-color-text item" data-toggle="pop-menu"></span>');
        $toggle.appendTo($container);
        return $container;
    };

    var getBackColorUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top"></div></div>');
        $pop_menu_wrapper.appendTo($container);
        var $toggle = $('<span class="item" data-toggle="pop-menu"><span class="back-color"></span></span>');
        $toggle.appendTo($container);
        return $container;
    };

    var getLinkUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top" style="min-width: 300px"></div></div>');
        $pop_menu_wrapper.appendTo($container);
        $('<div class="input-line">'+
            '<label>链接名</label>'+
            '<input class="input" />'+
         '</div><div class="input-line">'+   
            '<label>链接地址</label>'+
            '<input class="input" />'+
        '</div><div class="input-line">'+
            '<button class="btn success" style="width: 100%">确定</button>'+
        '</div>').click(function(e) {
            return false;
        }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        var $toggle = $('<span class="zmdi zmdi-link item" data-toggle="pop-menu"></span>');
        $toggle.appendTo($container);
        return $container;
    };

    var getTableUI = function() {
        var $container = $('<span class="pop-menu-container"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top" style="min-width: 300px"></div></div>');
        $pop_menu_wrapper.appendTo($container);
        $('<div class="input-line">'+
            '<label>链接名</label>'+
            '<input class="input" />'+
         '</div><div class="input-line">'+   
            '<label>链接地址</label>'+
            '<input class="input" />'+
        '</div><div class="input-line">'+
            '<button class="btn success" style="width: 100%">确定</button>'+
        '</div>').click(function(e) {
            return false;
        }).appendTo($pop_menu_wrapper.find('.pop-menu'));
        var $toggle = $('<span class="zmdi zmdi-grid item" data-toggle="pop-menu"></span>');
        $toggle.appendTo($container);
        return $container;
    };

    var toolbarItems = {
        foreColor: getForeColorUI(),
        backColor: getBackColorUI(),
        fontSize : getFontSizeUI(),
        heading : getHeadingUI(),
        link : getLinkUI(),
        table: getTableUI(),
        image : $('<span class="zmdi zmdi-collection-image item" for="#editor-select-image"></span>'),
        undo: $('<span class="zmdi zmdi-undo item" data-type="single-select" data-group="align"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        redo: $('<span class="zmdi zmdi-redo item" data-type="single-select" data-group="align"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        alignLeft: $('<span class="zmdi zmdi-format-align-left item" data-type="single-select" data-group="align"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        increaseIndent: $('<span class="zmdi zmdi-format-indent-increase item" data-type="single-select" data-group="align"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        decreaseIndent: $('<span class="zmdi zmdi-format-indent-decrease item" data-type="single-select" data-group="align"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        alignRight: $('<span class="zmdi zmdi-format-align-right item" data-type="single-select" data-group="align"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        alignCenter: $('<span class="zmdi zmdi-format-align-center item" data-type="single-select" data-group="align"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        alignFull: $('<span class="zmdi zmdi-format-align-justify item" data-type="single-select" data-group="align"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        underline : $('<span class="zmdi zmdi-format-underlined item" data-type="toggle" title="下划线"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        italic : $('<span class="zmdi zmdi-format-italic item" data-type="toggle" title="斜体字"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        bold : $('<span class="zmdi zmdi-format-bold item" data-type="toggle" title="粗体字"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        paste : $('<span class="zmdi zmdi-paste item" title="粘贴"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        cut : $('<span class="zmdi zmdi-crop item" title="剪切"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        copy : $('<span class="zmdi zmdi-copy item" title="复制"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        selectAll : $('<span class="zmdi zmdi-select-all item" title="全选"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        orderedList : $('<span class="zmdi zmdi-format-list-bulleted item" title="有序列表"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        unorderedList : $('<span class="zmdi zmdi-format-list-numbered item" title="无序列表"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
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
    }

    toolbar.prototype.update = function() {

        var doc = this.editor.getDocument();

        changeItemState(this.editor, 'bold', doc.queryCommandState('bold'));
        changeItemState(this.editor, 'italic', doc.queryCommandState('italic'));
        changeItemState(this.editor, 'underline', doc.queryCommandState('underline'));
        changeItemState(this.editor, 'alignLeft', doc.queryCommandState('justifyleft'));
        changeItemState(this.editor, 'alignRight', doc.queryCommandState('justifyright'));
        changeItemState(this.editor, 'alignCenter', doc.queryCommandState('justifycenter'));
        changeItemState(this.editor, 'alignFull', doc.queryCommandState('justifyfull'));

        this.editor.$toolbarContainer.find('[data-id=foreColor]')
            .find('[data-toggle=pop-menu]')
            .css('color', doc.queryCommandValue('forecolor'));

        this.editor.$toolbarContainer.find('[data-id=backColor]')
            .find('[data-toggle=pop-menu]')
            .css('color', doc.queryCommandValue('forecolor'));

        // 字体大小
        var sizearray = [10,12,16,18,24,32,48];
        var sizeindex = doc.queryCommandValue('fontsize');
        if(sizeindex == '') {
            var size = 16;
        } else {
            var size = sizearray[sizeindex - 1];
        }
        this.editor.$toolbarContainer.find('[data-id=fontsize]')
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
    }
    return {
        items: toolbarItems,
        init: function(editor) {
            return new toolbar(editor);
        }
    }
})();
