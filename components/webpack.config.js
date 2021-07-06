const path = require('path');

module.exports = {
    entry: "./src/index.tsx",
    mode: "none",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        publicPath: "/"
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
            {
                test: /\.(j|t)sx?$/,
                loader: "ts-loader"
            },
        ]
    },
}
