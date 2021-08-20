const path = require('path');

module.exports = {
    entry: "./src/index.ts",
    mode: "production",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].js",
        publicPath: "/",
        library: {
            type: 'window',
            name: 'Monitor'
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
				test: /\.(j|t)s$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							cacheDirectory: true,
							compact: false
						}
					},
                    {
						loader: "ts-loader"
					},
				]
			},
        ]
    },
}
