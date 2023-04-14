const { Builder, By, Key, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const credentials = require('./credentials');

async function login() {
  // Iterate over the credentials array and log in each user
  for (let i = 0; i < credentials.length; i++) {
    const { name, password, proxyHost, proxyPort, proxyUser, proxyPass, url } = credentials[i];

    // Set up Chrome options with proxy if credentials are provided
    let chromeOptions = new Options();
    if (proxyHost && proxyPort && proxyUser && proxyPass) {
      chromeOptions.addArguments(`--proxy-server=http://${proxyHost}:${proxyPort}`);
      chromeOptions.addArguments(`--proxy-auth=${proxyUser}:${proxyPass}`);
    }

    // Launch Chrome browser with options
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

    try {
      // Navigate to website
      await driver.get(url);

      // Wait for page to load
      await driver.wait(until.elementLocated(By.name('name')), 10000);

      // Find username and password fields and enter credentials
      await driver.findElement(By.name('name')).sendKeys(name);
      await driver.findElement(By.name('password')).sendKeys(password);

      // Click login button
      await driver.findElement(By.css('button[version="textButtonV1"]')).click();

      // Wait for 3 seconds
      await driver.sleep(3000);

      // Navigate to the Farming page
      await driver.get(`${url}/build.php?tt=99&id=39`);

      // Click Start Farming
      let start_buttons = await driver.findElements(By.xpath("//form/button[@value='Start']"));
      for (let i = 0; i < start_buttons.length; i++) {
        await start_buttons[i].click();
        await driver.sleep(3000); // 3-second interval
      }

      // Loop Farming 
      async function runCode() {
        let start_buttons = await driver.findElements(By.xpath("//form/button[@value='Start']"));
        for (let i = 0; i < start_buttons.length; i++) {
          await start_buttons[i].click();
          await driver.sleep(3000); // 3-second interval
        }
      }
      
      setInterval(runCode, 60000); // run the code every 1 minutes (60000 milliseconds)
      

    } finally {
      // Quit the browser
      //await driver.quit();
    }
  }
}

login();
