var EditorFunc = (function() {

    var htmlFunc = {
        code : function() {
            this.editor.getDocument().execCommand(
                'insertHTML', '<pre></pre>'
            );
        },
        clear: function() {
            this.editor.getDocument().execCommand('removeFormat');
        },
        link: function(href, label) {
            this.editor.getDocument().execCommand(
                'insertHTML', false, '<a href="'+href+'">'+label+'</a>'
            );
        },
        table: function(row, col) {
            var $table = $('<table></table>');
            for(var i = 0; i < row; ++i) {
                var $tr = $('<tr></tr>').appendTo($table);
                for(var j = 0; j < col; ++j) {
                    $('<td></td>').appendTo($tr);
                }
            }
            this.editor.getDocument().execCommand(
                'insertHTML', false, $('<div></div>').append($table).html()
            );
            return $table;
        },
        italic: function() {
            this.editor.getDocument().execCommand('italic');
        },
        bold: function() {
            this.editor.getDocument().execCommand('bold');
        },
        underline: function() {
            this.editor.getDocument().execCommand('underline');
        },
        selectAll: function() {
            this.editor.getDocument().execCommand('selectAll');
        },
        copy: function() {
            this.editor.getDocument().execCommand('copy');
        },
        cut: function() {
            this.editor.getDocument().execCommand('cut');
        },
        paste: function() {
            this.editor.getDocument().execCommand('paste');
        },
        orderedList: function() {
            this.editor.getDocument().execCommand('insertorderedlist');
        },
        unorderedList: function() {
            this.editor.getDocument().execCommand('insertunorderedlist');
        },
        image: function(url) {
            this.editor.getDocument().execCommand('insertimage', url);
        },
        alignLeft: function() {
            this.editor.getDocument().execCommand('justifyleft');
        },
        alignCenter: function() {
            this.editor.getDocument().execCommand('justifycenter');
        },
        alignRight: function() {
            this.editor.getDocument().execCommand('justifyright');
        },
        alignFull: function() {
            this.editor.getDocument().execCommand('justifyfull');
        },
        fontSize: function(size) {
            this.editor.getDocument().execCommand('fontSize', false, size);
        },
        foreColor: function(color) {
            this.editor.getDocument().execCommand('foreColor', false, color);
        },
        backColor: function(color) {
            this.editor.getDocument().execCommand('backColor', false, color);
        },
        heading: function(h) {
            if (parseInt(h) <= 6 && parseInt(h) >= 0) {
                this.editor.getDocument().execCommand('formatBlock', false, 'H'+(h+1));
                return;
            }
            this.editor.getDocument().execCommand('formatBlock', false, h);
        },
        increaseIndent: function() {
            this.editor.getDocument().execCommand('indent');
        },
        decreaseIndent: function() {
            this.editor.getDocument().execCommand('outdent');
        },
        redo: function() {
            this.editor.getDocument().execCommand('redo');
        },
        undo: function() {
            this.editor.getDocument().execCommand('undo');
        }
    };

    var markdownFunc = {};

    var editor_func = function(editor) {
        this.editor = editor;
    };

    return {
        hf: htmlFunc,
        mf: markdownFunc,
        init: function(editor) {
            var type = editor.config.type || 'html';
            if (type == 'html') {
                editor_func.prototype = htmlFunc;
            } else {
                editor_func.prototype = dropdownFunc;
            }
            return new editor_func(editor);
        }
    }
})();
