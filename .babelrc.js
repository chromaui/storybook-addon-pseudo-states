const modules = process.env.BABEL_ESM === 'true' ? false : 'auto';

module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: 'defaults',
                modules
            }
        ],
        "@babel/preset-react"
    ],
}
