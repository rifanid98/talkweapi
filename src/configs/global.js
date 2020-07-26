const config = {
  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  jwtSecretKey: process.env.JWT_KEY,
  jwtTokenLoginLifeTime: '7d',
  jwtTokenRefreshLifeTime: '7d',
  rootProjectPath: 'libraryapp-api',
  imageUrlPath: function (req) {
    return `${req.protocol}://${req.get("host")}/${this.rootProjectPath}/images/`;
  }
};

module.exports = config;