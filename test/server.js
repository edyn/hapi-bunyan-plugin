var Hapi = require('hapi'),
    HapiBunyan = require('../index'),
    bunyan = require('bunyan'),
    bunyanFormat = require('bunyan-format');

var server = new Hapi.Server(),
    log = bunyan.createLogger({
        name: 'test-server',
        stream: bunyanFormat({ outputMode: 'short' }),
        level: 'trace'
    });

server.connection({ port: 8000 });

server.register({
        register: HapiBunyan,
        options: {
            log: log,
            logInternal: true
        }
    },
    function(err) {
        if (err) {
            log.error(err);
        }
    }
);

server.route({
    method: 'GET',
    path: '/test',
    handler: function(req, reply) {
        reply('OK');
    }
});

server.start();
