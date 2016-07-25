(function($) {
    function openModal($modal) {
        var on = $modal.data('onOpen');
        if (typeof on === 'function') {
            on($modal);
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
            throw 'onclose not a function';
        }
        $modal.data('onClose', onclose);
    }
    function registerOnOpen($modal, onopen) {
        if (typeof onopen !== 'function') {
            throw 'onclose not a function';
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
});
