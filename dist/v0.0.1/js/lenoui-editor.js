var ColorSelector = function(onSelect) {
    onSelect = onSelect || function() {};

    var colors = ['#000000', '#FFFFFF', '#FF0000', '#FF7F00',
        '#FFFF00', '#00FFFF', '#0000FF', '#0066FF'];
    var node = $('<div class="color-selector"></div>');    
    var his = $('<div data-id="cs-f"></div>').css({
        borderBottom: '1px solid #999',
        margin: '0px 0px 5px 0px'
    }).appendTo(node);
    for(var i = 0; i < colors.length; ++i) {
        $('<span class="item"></span>').attr('data-id', colors[i])
            .attr('title', colors[i])
            .css('background-color', colors[i])
            .appendTo(his);
    }
    var content = $('<div class="selector-item-container"></div>');
    content.appendTo(node);
    var red = 0;
    var green = 0;
    var blue = 0;
    var container = content;
    for(var x = 0; x < 4; x++) {
        red = x*64;
        if(red.toString(16).length < 2) {
            red = '0'+red.toString(16);
        } else {
            red = red.toString(16);
        }
        for(var y = 0; y < 4; y++) {
            green = y*64;
            if(green.toString(16).length < 2) {
                green = '0'+green.toString(16);
            } else {
                green = green.toString(16);
            }
            for(var z = 0; z < 4; z++) {
                blue = z*64;
                if(blue.toString(16).length < 2) {
                    blue = '0'+blue.toString(16);
                } else {
                    blue = blue.toString(16);
                }
                var rgb = red+green+blue;
                $('<span data-id="#'+rgb+'"></span>').css({
                    backgroundColor: '#'+rgb
                }).addClass('item').attr('title', '#'+rgb)
                .appendTo(container);
            }
        }
    }
    node.find('.item').click(function() {
        var color = $(this).attr('data-id');
        onSelect(color);
    });
    return node;
};

var EditorFunc = (function() {
    var htmlFunc = {
        code : function(editor) {
            editor.getDocument().execCommand('insertHTML', '<pre></pre>');
        },
        clear: function(editor) {
            editor.getDocument().execCommand('removeFormat');
        },
        link: function(editor, href, label) {
            editor.getDocument().execCommand('insertHTML', false, '<a href="'+href+'">'+label+'</a>');
        },
        table: function(editor, row, col) {

        },
        italic: function(editor) {
            editor.getDocument().execCommand('italic');
        },
        bold: function(editor) {
            editor.getDocument().execCommand('bold');
        },
        underline: function(editor) {
            editor.getDocument().execCommand('underline');
        },
        selectAll: function(editor) {
            editor.getDocument().execCommand('selectAll');
        },
        copy: function(editor) {
            editor.getDocument().execCommand('copy');
        },
        cut: function(editor) {
            editor.getDocument().execCommand('cut');
        },
        paste: function(editor) {
            editor.getDocument().execCommand('paste');
        },
        orderedList: function(editor) {
            editor.getDocument().execCommand('insertorderedlist');
        },
        unorderedList: function(editor) {
            editor.getDocument().execCommand('insertunorderedlist');
        },
        image: function(editor, url) {
            editor.getDocument().execCommand('insertimage', url);
        },
        alignLeft: function(editor) {
            editor.getDocument().execCommand('justifyleft');
        },
        alignCenter: function(editor) {
            editor.getDocument().execCommand('justifycenter');
        },
        alignRight: function(editor) {
            editor.getDocument().execCommand('justifyright');
        },
        alignFull: function(editor) {
            editor.getDocument().execCommand('justifyfull');
        },
        fontSize: function(editor, size) {
            editor.getDocument().execCommand('fontSize', false, size);
        },
        foreColor: function(editor, color) {
            editor.getDocument().execCommand('foreColor', false, color);
        },
        backColor: function(editor, color) {
            editor.getDocument().execCommand('backColor', false, color);
        },
        heading: function(editor, h) {
            if (parseInt(h) <= 6 && parseInt(h) >= 0) {
                editor.getDocument().execCommand('formatBlock', false, 'H'+(h+1));
                return;
            }
            editor.getDocument().execCommand('formatBlock', false, h);
        },
        increaseIndent: function(editor) {
            editor.getDocument().execCommand('indent');
        },
        decreaseIndent: function(editor) {
            editor.getDocument().execCommand('outdent');
        },
        redo: function(editor) {
            editor.getDocument().execCommand('redo');
        },
        undo: function(editor) {
            editor.getDocument().execCommand('undo');
        }
    };

    var markdownFunc = {};

    var editor_func = function(editor) {
        this.editor = editor;
    };

    editor_func.prototype.getFunc = function(index) {
        var type = this.editor.config.type || 'html';
        if (type == 'html') {
            var func = htmlFunc;
        } else {
            var func = dropdownFunc;
        }
        return func[index];
    };

    return {
        hf: htmlFunc,
        mf: markdownFunc,
        init: function(editor) {
            return new editor_func(editor);
        }
    }
})();

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
    }
})();

var LenoEditor = (function() {
    var defaultConfig = {
        toolbar : [
            'selectAll', 'copy', 'cut', 'paste', 'sep',
            'bold', 'italic', 'underline', 'fontSize', 'foreColor', 'backColor', 'clear', 'code',  'sep',
            'alignLeft', 'alignCenter', 'alignRight', 'alignFull', 'sep',
            'heading', 'orderedList', 'unorderedList', 'sep',
            'image', 'link', 'table', 'sep',
            'increaseIndent', 'decreaseIndent', 'sep',
            'undo', 'redo'
        ],
        callback: {
            ready: function() {},
            input: function() {},
            focus: function() {}
        },
        toolbarFixedTop: 0,
        width: '100%',
        height: 300,
        type: 'html'     // html | dropdown
    };

    var constructUI = function(editor, $root) {
        var opts = editor.config;   
        var content = $root.html();
        $root.empty().addClass('editor');
        editor.$root = $root;
        if (!opts.toolbarContainer) {
            editor.$toolbarContainer = $('<div class="editor-toolbar-container"></div>');
            editor.$toolbarContainer.appendTo($root);
            editor.toolbarInside = true;
        } else {
            editor.$toolbarContainer = opts.toolbarContainer;
            editor.toolbarInside = false;
        }
        editor.$iframe = $('<iframe src=""></iframe>')
                .attr('width', opts.width)
                .attr('height', opts.height)
                .attr('frameborder', 0)
                .appendTo($root);
        editor.$statusbar = $('<div class="editor-statusbar lr"><span data-id="at"></span></div>');
        editor.$statusbar.appendTo($root);
        editor.toolbar = EditorToolbar.init(editor);
        return content;
    };

    var editor = function($root) {
        var self = this;
        self.config = defaultConfig;
        $.extend(true, self.config, $root.data('editor-config') || {});
        var content = constructUI(self, $root);
        window.onload = function() {
            editor.init(self);
            self.setContent(content);
        };
    };

    editor.init = function(editor) {
        var doc = editor.getDocument();
        doc.designMode = 'On';
        var bodies = doc.getElementsByTagName('body');
        $(bodies[0]).css('overflow-y', 'hidden');
        var $toolbar = editor.$toolbarContainer.find('.editor-toolbar');
        var toolbar_pos = $toolbar.pos();
        $(window).scroll(function() {
            $toolbar.css('top', Math.max(toolbar_pos.y - 18, $(window).scrollTop() + editor.config.toolbarFixedTop));
            var now_toolbar_pos = $toolbar.pos();
            if (now_toolbar_pos.y + $toolbar.height() > editor.getY() + editor.getH()) {
                $toolbar.css('transform', 'scale(0)');
                return;
            }
            $toolbar.css('transform', 'scale(1)');
        });
        $(window).resize(function() {
            editor.resize();
        });
        editor.resize();
        $(editor.getDocument()).bind('input propertychange', function() {
            editor.config.callback.input(editor);
            editor.resizeContent();
            editor.toolbar.update();
        }).click(function() {
            editor.focus();
        });
    };

    editor.prototype.getDocument = function() {
        return this.$iframe.get(0).contentWindow.document;
    };

    editor.prototype.setContent = function(content) {
        var doc = this.getDocument();
        var body = doc.getElementsByTagName('body');
        body[0].focus();
        body[0].innerHTML = content;
        this.resizeContent();
        return this;
    };

    editor.prototype.resizeContent = function() {
        var me = this;
        var doc = me.getDocument();
        var bodys = doc.getElementsByTagName('body');
        if (this.toobarInside) {
            var toolbarHeight = me.$toolbarContainer.height();
            var height = Math.max(
                bodys[0].offsetHeight + toolbarHeight + 30,
                me.config.height
            );
        } else {
            var height = Math.max(me.config.height, bodys[0].offsetHeight + 30);
        }
        me.resize(me.config.width, height);
    };

    editor.prototype.resize = function(width, height)
    {
        var me = this;
        width = width || me.config.width;
        height = height || me.config.height;

        me.$root.css('width', width);
        me.$root.height(height);
        if (this.toolbarInside) {
            var $toolbar = me.$toolbarContainer.find('.editor-toolbar');
            $toolbar.width(me.$toolbarContainer.width() - 1);
            me.$toolbarContainer.height($toolbar.height());
            var frameHeight = height - me.$toolbarContainer.height() - 30;
        } else {
            var frameHeight = height - 30;   
        }

        me.$iframe.attr('width', width);
        me.$iframe.attr('height', frameHeight);
        return me;
    };
    editor.prototype.focus = function() {
        this.$iframe.focus();
        this.toolbar.update();
        this.toolbar.closePopMenu();
        var focus = this.config.callback.focus;
        if (typeof focus == 'function') {
            focus(this);
        }
        return this;
    };
    editor.prototype.getY = function() {
        var pos = this.$root.pos();
        return pos.y;
    };
    editor.prototype.getX = function() {
        var pos = this.$root.pos();
        return pos.x;
    };
    editor.prototype.getH = function() {
        return this.$root.height();
    };
    editor.prototype.getW = function() {
        return this.$root.width();
    };
    editor.prototype.getHtml = function() {
        var doc = this.getDocument();
        var body = doc.getElementsByTagName('body');
        return $(body[0]).html();
    };
    editor.prototype.getText = function() {
        var doc = this.getDocument();
        var body = doc.getElementsByTagName('body');
        return $(body[0]).text();
    };
    return editor;
})();

(function($) {
    $.fn.configEditor = function(config) {
        $(this).data('editor-config', config);
        return $(this);
    };
    $.fn.getEditor = function() {
        var editor = $(this).data('editor');
        if (!editor) {
            $(this).data('editor', new LenoEditor($(this)));
        }
        return $(this).data('editor');
    };
    $.fn.listen = function(callback) {
        $(this).data('toolbar-item-click', callback);
        return $(this);
    };
    $.fn.ofEditor = function(editor) {
        $(this).data('editor', editor);
        return $(this);
    };
})(jQuery);
