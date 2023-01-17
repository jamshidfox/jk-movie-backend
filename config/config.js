const configs = {
  mongoHost: getConf("MONGO_HOST", "localhost"),
  mongoPort: getConf("MONGO_PORT", "27017"),
  mongoUser: getConf("MONGO_USER", "payment_service"),
  mongoPassword: getConf("MONGO_PASSWORD", "mongodb"),
  mongoDatabase: getConf("MONGO_DATABASE", "mongodb"),
  mongoDB:
    "mongodb+srv://Jamshidbek:Hopes5778$@cluster0.b9gtufk.mongodb.net/?retryWrites=true&w=majority",
  Environment: getConf("ENVIRONMENT", "production"),
}

function getConf(name, def = "") {
  if (process.env[name]) {
    return process.env[name]
  }
  return def
}

module.exports = configs
