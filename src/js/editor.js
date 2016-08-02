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
