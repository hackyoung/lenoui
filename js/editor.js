var LenoEditor = (function() {

    var defaultConfig = {
        toolbar : [
            'selectAll', 'copy', 'cut', 'paste', 'sep',
            'bold', 'italic', 'underline', 'fontSize', 'foreColor', 'backColor', 'sep',
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
        editor.$statusbar = $('<div class="editor-statusbar lr"><span data-id="at"></span></div>');
        editor.$statusbar.appendTo($root);
        editor.toolbar = EditorToolbar.init(editor);
    }

    var editor = function($root) {
        var self = this;
        self.config = defaultConfig;
        $.extend(true, self.config, $root.data('editor-config') || {});
        constructUI(self, $root);
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
            $toolbar.css('top', Math.max(toolbar_pos.y - 18, $(window).scrollTop() + editor.config.toolbarFixedTop));
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
            editor.toolbar.update();
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
            bodys[0].offsetHeight + toolbarHeight + 30,
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
        $toolbar.width(me.$toolbarContainer.width() - 1);
        me.$toolbarContainer.height($toolbar.height());

        me.$iframe.attr('width', width);
        var frameHeight = height - me.$toolbarContainer.height() - 30;
        me.$iframe.attr('height', frameHeight);
        return me;
    }
    editor.prototype.focus = function() {
        this.$iframe.focus();
        this.toolbar.update();
        var focus = this.config.callback.focus;
        if (typeof focus == 'function') {
            focus(this);
        }
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
