class Config {
  constructor(data) {
    this.data = data;

    // Allow easy access to the config data.
    for (let prop in data) {
      this[prop] = data[prop];
    }
  }
}

module.exports = Config;
