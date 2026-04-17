module.exports = {
    apps: [
        {
            name: 'recipe-app',
            script: './dist/index.js',
            node_args: '--env-file=.env.production',
        },
    ],
};