# Hapi Bunyan Plugin

Integrates [bunyan][bunyan_homepage] with [Hapi.js][hapi_homepage] by wiring
a bunyan Logger instance into the published [server events][hapi_server_events].

Allows structured json logging of the Hapi.Server generated log messages. Using
[server.log()][hapi_server_log] and [request.log()][hapi_request_log] will be
routed through the bunyan Logger as well.

## Usage

    var Hapi = require('hapi'),
        HapiBunyan = require('hapi-bunyan'),
        bunyan = require('bunyan');

    var server = new Hapi.Server(),
        log = bunyan.createLogger({
            name: 'my-application',
            level: 'debug'
        });

    server.connection({ port: 8000 });

    server.register({
        register: HapiBunyan,
        options: {
            log: log
        }
    });

    // other server configuration, routes, etc.

    server.start();

## Configuration

The options object used when registering the plugin takes the following properties:

* log - the bunyan Logger instance. (required)
* logInternal - boolean value, defaults to false. Set to true to enable
                logging of Hapi.Server internal events.

## License

MIT. See [LICENSE.txt](LICENSE.txt).

[bunyan_homepage]: https://github.com/trentm/node-bunyan
[hapi_homepage]: http://hapijs.com/
[hapi_server_events]: http://hapijs.com/api#server-events
[hapi_server_log]: http://hapijs.com/api#requestlogtags-data-timestamp
[hapi_request_log]: http://hapijs.com/api#requestlogtags-data-timestamp
