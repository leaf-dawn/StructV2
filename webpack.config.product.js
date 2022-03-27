
module.exports = {
    mode: 'production',
    entry: './src/StructV.ts',
    output: {
        filename: './sv.js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    }
};
