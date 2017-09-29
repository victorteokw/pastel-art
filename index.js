const chalk = require('chalk');
const path = require('path');
const os = require('os');
const fs = require('fs');

let colors = ["blue", "magenta", "cyan", "white", "gray"];

let tmpFile = path.join(os.tmpdir(), 'com.paratrips.logger.index');
if (!fs.existsSync(tmpFile)) {
  fs.writeFileSync(tmpFile, '-1');
}

let index = parseInt(fs.readFileSync(tmpFile).toString());
if (isNaN(index)) index = -1;
index += 1;
index = index % colors.length;

fs.writeFileSync(tmpFile, `${index}`);

module.exports = function(sender, env = "development") {
  return {
    _formatMessageForConsole: function(level, ...message) {
      let levelModifier = " ";
      if (level === "warn") {
        levelModifier = " " + chalk.yellow("[WARN]") + " ";
      } else if (level === "error") {
        levelModifier = " " + chalk.red("[ERROR]") + " ";
      }
      let head = message.shift();
      return [`${chalk.bold[colors[index]]("[" + sender + "]")}${levelModifier}${head}`].concat(message);
    },
    _log: function(level, ...message) {
      if (env === 'development') {
        console.log(...this._formatMessageForConsole(level, ...message));
      }
    },
    log: function(...message) {
      this._log("log", ...message);
    },
    warn: function(...message) {
      this._log("warn", ...message);
    },
    error: function(...message) {
      this._log("error", ...message);
    }
  };
};
