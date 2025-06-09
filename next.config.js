module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.canary.mx",
				port: "*",
				pathname: "/api/**",
			},
		],
	},
};
