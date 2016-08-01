var EditorFunc = (function() {

    var htmlFunc = {
        link: function(editor, text, href) {
        
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
        
        },
        foreColor: function(editor, color) {
        
        },
        backColor: function(editor, color) {
        
        },
        heading: function(editor, h) {
            
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
