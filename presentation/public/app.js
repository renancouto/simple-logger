function SimpleLogger(url) {
    this.VERSION = '0.0.1';

    // elements
    this.$body = $('body');
    this.$displayer = $('#displayer');
    this.$logger = $('#logger');

    // templates
    this.$tmplDisplayer = $('#tmpl-displayer').html();
    this.$tmplLogger = $('#tmpl-logger').html();

    this.start(url);
}

SimpleLogger.prototype.start = function(url) {
    var self = this,
        socket = io.connect(url);

    socket.on('message', function(data) {
        if (data.message) self.update(data.message);
        else console.log('Socket.io error:', data);
    });
};

SimpleLogger.prototype.update = function(data) {
    var self = this,
        context = { variable: 'it' };

    function render($el) {
        return _.template($el, data, context);
    }

    if (data.style) this.$body.attr('class', data.style);
    if (data.heading) this.$displayer.html(render(self.$tmplDisplayer));
    if (data.items) this.$logger.prepend(render(self.$tmplLogger));
};