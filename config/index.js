const config = {
    development: {
        DB_URI: 'mongodb://localhost/Game-Hub-153-DB',
    },
    production: {
        DB_URI: 'mongodb://localhost/Game-Hub-153-DB',
    }
}

module.exports = config[process.env.NODE_ENV.trim()]