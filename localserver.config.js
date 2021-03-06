module.exports = {
  apps: [{
    name: "cyberlabserver",
    script: "./server/index.js",
    output: './logs/out.log',
    error: './logs/error.log',
    log: './logs/combined.outerr.log',
    merge_logs: true,
    instances: 0,
    watch: false,
    exec_mode: "cluster",
    env_development: {
      NODE_ENV: "development",
      PORT: 3000,
      MONGO_STRING: "mongodb://localhost:27017/db",
      AI_URL: "http://localhost:5000/",
      UPLOAD_PATH: "uploads/"
    }
  }]
};
