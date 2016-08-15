var lenoui = (function($) {
    function openModal($modal) {
        var on = $modal.data('onOpen');
        if (typeof on === 'function') {
            on($modal);
        }
        var tab = $modal.data('tab');
        if (tab) {
            $.activeTag(tab);
        }
        $modal.addClass('show');
    }
    function closeModal($modal) {
        var on = $modal.data('onClose');
        if (typeof on === 'function') {
            on($modal);
        }
        $modal.removeClass('show');
    }
    function registerOnClose($modal, onclose) {
        if (typeof onclose !== 'function') {
            return;
        }
        $modal.data('onClose', onclose);
    }
    function registerOnOpen($modal, onopen) {
        if (typeof onopen !== 'function') {
            return;
        }
        $modal.data('onOpen', onopen);
    }
    $.fn.luiModal = function(opt, callback) {
        switch(opt) {
            case 'modal.open':
                return openModal($(this));
            case 'modal.close':
                return closeModal($(this));
            case 'modal.on.close':
                return registerOnClose($(this), callback);
            case 'modal.on.open':
                return registerOnOpen($(this), callback);
        }
    }
    $.fn.pos = function() {
        var obj = $(this).get(0);
        if(obj.length !== null && obj.length > 0) {
            obj = obj.get(0);
        }
        for(var y = obj.offsetTop, x=obj.offsetLeft; 
                                            obj=obj.offsetParent;) {
            y += obj.offsetTop;
            x += obj.offsetLeft;
        }
        return {x: x, y: y};
    };
    $.fn.popMenu = function() {
        $(this).click(function(e) {
            e.stopPropagation();
            var $p = $(this).parent();
            if ($p.hasClass('active')) {
                $p.removeClass('active');
                return;
            }
            $p.addClass('active');
            return false;
        });
        return $(this);
    }
    $.fn.form = function() {
        var $me = $(this);
        var url = $me.attr('href'); 
        var method = $me.attr('data-method') || 'get';
        var redirect = $me.attr('data-redirect');
        $me.find('[data-id=submit]').click(function() {
            var data = {};
            var error = false;
            $me.find('input, textarea, select').each(function() {
                var $item = $(this);
                var regexp = $item.attr('regexp');
                var val = $item.val();
                if (regexp && !(new RegExp(regexp)).test($item.val())) {
                    error = true;   
                    lenoui.alert($item.attr('error-msg') || '请检查参数');
                }
                data[$item.attr('name')] = val;
            });
            if (error) {
                return;
            }
            var before = $me.data('before');
            if (typeof before == 'function' && !before.call($me, data)) {
                return;
            }
            var success = $me.data('success') || function(res) {
                if (!redirect) {
                    return;
                }
                window.location.href = redirect;
            };
            var error = $me.data('error') || function (res) {
                lenoui.alert(res.responseText);
            };
            lenoui.ajax({
                url: url,
                method: method,
                data: data,
                _success: success,
                _error: error
            });
        });
    };
    $.activeTag = function(id) {
        $('[data-toggle=tab]').filter('[for='+id+']').click();
    };

    var lenoui_alert = function(msg) {
        alert(msg);
    };

    var lenoui_ajax = function(opts) {
        var timeout = 20000;   // 20秒超时
        var method = opts.method || 'post';
        opts._success = opts._success || function(res) {};
        opts._error = opts._error || function(res) {
            lenoui.alert(res.responseText);
        };
        opts.data = opts.data || {};
        if (opts.method != 'get') {
            opts.data._method = opts.method;
        }
        opts.type = opts.method !== 'get' ? 'POST' : 'GET';
        opts.timeout = opts.timeout || timeout;
        opts.complete = function(res) {
            if (res.status == 200) {
                opts._success(res);
                return;
            }
            opts._error(res);
        };
        delete opts.method;
        $.ajax(opts);
    };

    var lenoui_empty = function(obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        if (obj.length && obj.length == 0) {
            return true;
        }
        if (typeof obj == 'object') {
            for(var i in obj) {
                return false;
            }
            return true;
        }
        return false;
    }

    return {
        alert : lenoui_alert,
        ajax: lenoui_ajax,
        empty: lenoui_empty
    };
})(jQuery);

$(function() {
    /**
     * 初始化modal-toggle
     */
    $('[data-toggle=modal]').click(function() {
        var selector = $(this).attr('for');
        var tab = $(this).attr('data-tab');
        var $modal = $(selector);
        if (tab) {
            $modal.data('tab', tab);
        }
        $modal.luiModal('modal.open');
    });
    /**
     * 初始化modal
     */
    $('.modal').find('.close').click(function() {
        var $p = $(this).parent();
        while(!$p.hasClass('modal')) {
            $p = $p.parent();
        }
        $p.luiModal('modal.close');
    });

    /**
     * 初始化tab
     */
    $('[data-toggle=tab]').click(function() {
        var $self = $(this);
        var selector = $self.attr('for');
        $self.addClass('active').siblings().removeClass('active');
        $('#'+selector).addClass('active').siblings().removeClass('active');
    });

    /**
     * 初始化list
     */
    $('.list>.item').click(function() {
        var $self = $(this);
        var $parent = $self.parent();
        if (!$parent.hasClass('multi-select')) {
            $self.siblings().removeClass('active');
        }
        if ($self.hasClass('active')) {
            $self.removeClass('active');
            return;
        }
        $self.addClass('active');
    });

    /**
     * 初始化pop-menu
     */
    $('[data-toggle=pop-menu]').click(function(e) {
        var $p = $(this).parent();
        if ($p.hasClass('active')) {
            $p.removeClass('active');
            return false;
        }
        $p.addClass('active');
        return false;
    });
    $('.pop-menu-container .pop-menu').click(function() {
        return false;
    });
    $(document).click(function() {
        $('[data-toggle=pop-menu]').each(function() {
            $(this).parent().removeClass('active');
        });
    });

    setTimeout(function() {
        /**
         * 初始化fixedable
         */
        $('.fixedable').each(function() {
            var $content = $(this).find('.fixedable-content');
            $content.width($(this).width());
            $(this).height($content.height());
        });
    }, 500);
    $('.fixedable').each(function() {
        var $content = $(this).find('.fixedable-content');
        $content.width($(this).width());
        $(this).height($content.height());
    });
    $(window).scroll(function() {
        $('.fixedable').each(function() {
            var base = $(this).pos().y;
            var other = $(window).scrollTop() + (parseInt($(this).attr('data-fixedable-base')) || 0);
            $(this).find('.fixedable-content').css('top', Math.max(base, other));
        });
    }).resize(function() {
        $('.fixedable').each(function() {
            var $content = $(this).find('.fixedable-content');
            $content.width($(this).width());
            $(this).height($content.height());
        });
    });

    $('.form').each(function() {
        $(this).form();
    });
});
