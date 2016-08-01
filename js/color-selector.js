var ColorSelector = function(onSelect) {

    onSelect = onSelect || function() {};

    var colors = ['#000000', '#FFFFFF', '#FF0000', '#FF7F00',
        '#FFFF00', '#00FFFF', '#0000FF', '#8B00FF'];
    var node = $('<div class="leno-color-selector"></div>');    
    var his = $('<div data-id="cs-f"></div>').css({
        borderBottom: '1px solid #999',
        margin: '0px 0px 5px 0px'
    }).appendTo(node);
    for(var i = 0; i < colors.length; ++i) {
        $('<span class="selector-item" data-id="'+colors[i]+'" style="background-color: '+colors[i]+'"></span>').appendTo(his);
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
                }).addClass('selector-item').appendTo(container);
            }
        }
    }
    node.find('.selector-item').click(function() {
        var color = $(this).attr('data-id');
        onSelect(color);
    });
    return node;
}
