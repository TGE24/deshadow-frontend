module.exports = {
	apps: [
		{
			name: "web",
			script: "bun",
			args: "run preview",
			cwd: process.cwd(),
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: "1G",
			env: {
				NODE_ENV: "production",
				PORT: process.env.PORT || 3000,
				HOST: "0.0.0.0",
			},
			env_production: {
				NODE_ENV: "production",
				PORT: process.env.PORT || 3000,
				HOST: "0.0.0.0",
			},
			error_file: "./logs/err.log",
			out_file: "./logs/out.log",
			log_file: "./logs/combined.log",
			time: true,
			log_date_format: "YYYY-MM-DD HH:mm Z",
			merge_logs: true,
		},
	],
};
