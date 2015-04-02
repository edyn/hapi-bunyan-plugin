'use strict';

var LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
    pkg = require('./package.json');

function getLogLevel(tags) {
    return LOG_LEVELS.reduce(function(selectedLogLevel, level) {
        level = level.toLowerCase();
        if (tags[level]) { selectedLogLevel = level; }
        return selectedLogLevel;
    }, 'debug');
}

module.exports = {
    register: function(server, options, next) {
        var logInternal = options.logInternal === true,
            log;

        if (!options.log) {
            next(new Error('A bunyan Logger is required.'));
            return;
        }

        log = options.log.child({ plugin: pkg.name });

        if (logInternal) {
            log.debug('logging internal server events');
        }

        server.on('log', function(event, tags) {
            if (event.internal && !logInternal) {
                return;
            }

            event.eventType = 'log';
            log[getLogLevel(tags)](event);
        });

        server.on('request', function(request, event, tags) {
            event.eventType = 'request';
            log[getLogLevel(tags)](event);
        });

        server.on('request-internal', function(request, event, tags) {
            if (event.internal && !logInternal) {
                return;
            }

            event.eventType = 'request-internal';
            log[getLogLevel(tags)](event);
        });

        server.on('request-error', function(request, err) {
            log.error({ eventType: 'request-error', url: request.url.href,  error: err });
        });

        server.on('response', function(request) {
            log.debug({ eventType: 'response', request: request.id });
        });

        server.on('start', function() {
            server.connections.forEach(function(connection) {
                log.info({ eventType: 'start' }, 'Started on: http://%s:%d [%s]',
                    connection.info.address, connection.info.port, connection.info.host);
            });
        });

        server.on('stop', function() {
            log.info({ eventType: 'stop' }, 'Stopped');
        });

        next();
    }
};

module.exports.register.attributes = {
    pkg: pkg
};


