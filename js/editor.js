var LenoEditor = (function() {

    var defaultConfig = {
        toolbar : [''],
        callback: {
            ready: function() {},
            input: function() {}
        },
        toolbarFixedTop: 0,
        width: '100%',
        height: 300,
        type: 'html'     // html | dropdown
    };

    var htmlFunctions = {
        heading: function(editor, h) {},
        backColor: function(editor, color) {
        
        },
        foreColor: function(editor, color) {
        
        },
        fontSize: function(editor, size) {
        
        },
        underline: function(editor) {
        
        },
        bold: function(editor) {
        
        },
        italic: function(editor) {
        
        },
        cut: function(editor) {
        
        },
        paste: function(editor) {
        
        },
        selectAll : function(editor) {
        
        },
        copy: function(editor) {
        
        },
        orderedList : function(editor) {
            editor.getDocument().execCommend('InsertOrderedList');
        },
        unorderedList : function(editor) {
            editor.getDocument().execCommend('InsertUnorderedList');
        },
    };

    var dropdownFunctions = {
        orderedList : function(editor) {
        
        },
        unorderedList : function(editor) {
        
        }
    };

    var constructInterface = function(editor, $root) {
        var opts = editor.config;   
        $root.addClass('editor');
        editor.$root = $root;
        if (!opts.toolbarContainer) {
            editor.$toolbarContainer = $('<div class="editor-toolbar-container"></div>');
        } else {
            editor.$toolbarContainer = opts.toolbarContainer;
        }
        editor.$toolbarContainer.appendTo($root);
        editor.$iframe = $('<iframe src=""></iframe>');
        editor.$iframe.attr('width', opts.width);
        editor.$iframe.attr('height', opts.height);
        editor.$iframe.attr('frameborder', 0);
        editor.$iframe.appendTo($root);
        addItemsToToolbar(editor);
    }

    var getFunctionsOfType = function(type)
    {
        if (type == 'html') {
            return htmlFunctions;
        } else if (type == 'dropdown') {
            return dropdownFunctions;
        }
    }

    var normalInitToolbarItem = function($item) {
        var editor = $item.data('editor');
        var func = $item.data('toolbar-item-click');
        func(editor);
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
        var $container = $('<span class="pop-menu-container item"></span>');
        var $pop_menu_wrapper = $('<div class="pop-menu-wrapper"><div class="pop-menu arrow-top"></div></div>');
        $pop_menu_wrapper.appendTo($container);
    };
    var toolbarItems = {
//        foreColor: getForeColorUI(),
        fontSize: getFontSizeUI(),
        heading: getHeadingUI(),
        underline: $('<span class="zmdi zmdi-format-underlined item" title="下划线"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        italic: $('<span class="zmdi zmdi-format-italic item" title="斜体字"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        bold: $('<span class="zmdi zmdi-format-bold item" title="粗体字"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        paste: $('<span class="zmdi zmdi-paste item" title="粘贴"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        cut: $('<span class="zmdi zmdi-crop item" title="剪切"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        copy: $('<span class="zmdi zmdi-copy item" title="复制"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        selectAll: $('<span class="zmdi zmdi-select-all item" title="全选"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        orderedList : $('<span class="zmdi zmdi-format-list-bulleted item" title="有序列表"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
        unorderedList : $('<span class="zmdi zmdi-format-list-numbered item" title="无序列表"></span>').click(function() {
            normalInitToolbarItem($(this));
        }),
    };

    var addItemsToToolbar = function(editor) {
        var $container = editor.$toolbarContainer;
        var $toolbar = $('<div class="editor-toolbar"></div>').appendTo($container);
        var functions = getFunctionsOfType(editor.config.type);
        for(var i in toolbarItems) {
            var $item = toolbarItems[i];
            if (typeof functions[i] !== 'function') {
                continue;
            }
            $item.ofEditor(editor).listen(functions[i]);
            $item.appendTo($toolbar);
        }
    }

    var editor = function($root) {
        var self = this;
        self.config = defaultConfig;
        $.extend(true, self.config, $root.data('editor-config') || {});
        constructInterface(self, $root);
        window.onload = function() {
            editor.init(self);
        };
    }

    editor.init = function(editor) {
        var doc = editor.getDocument();
        doc.designMode = 'On';
        var bodies = doc.getElementsByTagName('body');
        $(bodies[0]).css('overflow-y', 'hidden');
        var $toolbar = editor.$toolbarContainer.find('.editor-toolbar');
        var toolbar_pos = $toolbar.pos();
        $(window).scroll(function() {
            $toolbar.css('top', Math.max(toolbar_pos.y - 15, $(window).scrollTop() + editor.config.toolbarFixedTop));
        });
        $(window).resize(function() {
            editor.resize();
        });
        editor.resize();
        $(editor.getDocument()).bind('input propertychange', function() {
            editor.resizeContent();
        });
    }
    editor.prototype.getDocument = function() {
        return this.$iframe.get(0).contentWindow.document;
    }

    editor.prototype.setContent = function(content) {
        var doc = this.getDocument();
        var body = doc.getElementsByTagName('body');
        body[0].focus();
        body[0].innerHTML = content;
        this.resizeContent();
        return this;
    }

    editor.prototype.resizeContent = function() {
        var me = this;
        var toolbarHeight = me.$toolbarContainer.height();
        var doc = me.getDocument();
        var bodys = doc.getElementsByTagName('body');
        var height = Math.max(
            bodys[0].offsetHeight + toolbarHeight,
            me.config.height
        );
        me.resize(me.config.width, height);
    }

    editor.prototype.resize = function(width, height)
    {
        var me = this;
        width = width || me.config.width;
        height = height || me.config.height;

        me.$root.css('width', width);
        me.$root.height(height);

        var $toolbar = me.$toolbarContainer.find('.editor-toolbar');
        $toolbar.width(me.$toolbarContainer.width() - 11);
        me.$toolbarContainer.height($toolbar.height());

        me.$iframe.attr('width', width);
        var frameHeight = height - me.$toolbarContainer.height();
        me.$iframe.attr('height', frameHeight);
        return me;
    }

    editor.prototype.focus = function() {
        var frame = this.editorContent.getFrame();
        frame.focus();
        return this;
    }

    return editor;
})();

(function($) {

    $.fn.configEditor = function(config) {
        $(this).data('editor-config', config);
        return $(this);
    };
    $.fn.getEditor = function() {
        var editor = $(this).data('editor');
        if (editor) {
            return editor;
        }
        return new LenoEditor($(this));
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
