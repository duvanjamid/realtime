module.exports = {
  env: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
  dev: process.env.NODE_ENV !== 'production',
  host: '0.0.0.0',
  port: 9700,
  mysql: {
    host: '127.0.0.1',
    port: 3306,
    db: 'diamante_test',
    user: 'root',
    pass: 'admin',
  },
  session: {
    name: 'appsession',
    secret: '1234567890',
  },
};
