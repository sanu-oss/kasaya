const fs = require('fs');
const { validateBrowser } = require('../../utils/validate');

module.exports = async (state, context) => {
  const browser = validateBrowser(state);

  const { output } = context.args;

  function writeScreenShot(data, filename) {
    const stream = fs.createWriteStream(filename);
    stream.write(Buffer.from(data, 'base64'));
    stream.end();
  }

  const png = await browser.takeScreenshot();
  writeScreenShot(png, output);
};
