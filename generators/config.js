class Config {
  constructor(data) {
    this.data = data;

    // Allow easy access to the config data.
    Object.entries(data).forEach(([key, value]) => {
      this[key] = value;
    });
  }
}

module.exports = Config;
