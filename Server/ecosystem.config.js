module.exports = {
    apps: [
        {
            name: 'Backend',
            script: './dist/index.js',
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};