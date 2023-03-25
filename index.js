const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');

const { createInstance } = require('./instance');

module.exports.createInstance = async ({
  key,
  url,
  useParallelPages,
  browserArgs = [],
} = {}) => {
  const browser = await puppeteer.launch({
    args: [
      ...chrome.args,
      '--no-sandbox',
      '--hide-scrollbars',
      '--disable-web-security',
      '--allow-file-access-from-files',
      // more info about --disable-dev-shm-usage
      // https://github.com/puppeteer/puppeteer/issues/1175#issuecomment-369728215
      // https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#tips
      '--disable-dev-shm-usage',
      ...browserArgs,
    ],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
    timeout: 120 * 1000,
  });

  return await createInstance({
    browser,
    key,
    url,
    useParallelPages,
    browserArgs,
  });
};
