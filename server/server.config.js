module.exports = {
  apps: [{
    name: "cyberlabserver",
    script: "./index.js",
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
      MONGO_STRING: "mongodb://mongodb:27017/db"
    }
  }]
};
