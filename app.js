'use strict';
const path = require("path");
const Hapi = require('@hapi/hapi');
const routes = require("./routes");


const init = async () => {
    const server = Hapi.server({
        port: 3333,
        host: '0.0.0.0',
        routes: {
            cors: true,
            files: {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    });
    await server.register(require('@hapi/inert'));
    server.route(routes);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();