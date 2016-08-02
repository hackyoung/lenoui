(function($) {
    function openModal($modal) {
        var on = $modal.data('onOpen');
        if (typeof on === 'function') {
            on($modal);
        }
        $modal.addClass('show');
    };
    function closeModal($modal) {
        var on = $modal.data('onClose');
        if (typeof on === 'function') {
            on($modal);
        }
        $modal.removeClass('show');
    };
    function registerOnClose($modal, onclose) {
        if (typeof onclose !== 'function') {
            return;
        }
        $modal.data('onClose', onclose);
    };
    function registerOnOpen($modal, onopen) {
        if (typeof onopen !== 'function') {
            return;
        }
        $modal.data('onOpen', onopen);
    };
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
    };
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
    };
    $.activeTag = function(id) {
        $('[data-toggle=tab]').filter('[for='+id+']').click();
    };
})(jQuery);

$(function() {
    /**
     * 初始化modal-toggle
     */
    $('[data-toggle=modal]').click(function() {
        var selector = $(this).attr('for');
        $(selector).luiModal('modal.open');
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
    $(document).click(function() {
        $('[data-toggle=pop-menu]').each(function() {
            $(this).parent().removeClass('active');
        });
    });
});
