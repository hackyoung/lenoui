var EditorFunc = (function() {
    var htmlFunc = {
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
    }

    editor_func.prototype.getFunc = function(index) {
        var type = this.editor.config.type || 'html';
        if (type == 'html') {
            var func = htmlFunc;
        } else {
            var func = dropdownFunc;
        }
        return func[index];
    }

    return {
        hf: htmlFunc,
        mf: markdownFunc,
        init: function(editor) {
            return new editor_func(editor);
        }
    }
})();
