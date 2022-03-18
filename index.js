const { create, decryptMedia, ev } = require("@open-wa/wa-automate");
const { Client } = require('pg');

let linux;
const win = {executablePath: "C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"}
if (process.env.HEROKU){linux = {executablePath: "/app/.apt/usr/bin/google-chrome"}} 
else {linux = {executablePath: "/usr/bin/chromium-browser"}}
const mac = {executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}

const configObject = {
  sessionId: "luiibot-clients",
  authTimeout: 0,
  autoRefresh: true,
  cacheEnabled: false,
  cachedPatch: true,
  multiDevice: true,
  useChrome: true,
  disableSpins: true,
  headless: true,
  qrRefreshS: 20,
  qrTimeout: 0,
  skipSessionSave: true,
};

const client = new Client({
  connectionString: 'postgres://ibzayihdsypetv:fb9ab7aa022ee0120a78af107c92d8450f212180b692763dddb95316840e2247@ec2-18-202-1-222.eu-west-1.compute.amazonaws.com:5432/d7iegh6u8nc9c6',
  ssl: {
    rejectUnauthorized: false
  }
});

const ops = process.platform;
if (ops === "win32" || ops === "win64") {const assignObj = Object.assign(configObject, win)}
else if (ops === "linux") {const assignObj = Object.assign(configObject, linux)}
else if (ops === "darwin") {const assignObj = Object.assign(configObject, mac)};

ev.on('sessionDataBase64.**', async (sessionData, sessionId) => {
  console.log(`Get Session data!\nSessionid : ${sessionId}, SessionData :`)
  console.log(sessionData)
  client.query(`DELETE FROM key;`)
  client.query(`INSERT INTO key (sessiondata) VALUES ('${sessionData}');`, (err, res) => {
    if (err) throw err;
    console.log('Session data inserted to database successfully!')
    client.end()
  });
  
})

const startBot = async () => {
  try {
/*    await client.connect();

    await client.query('SELECT * FROM key;', (err, res) => {
      if (err) throw err;
      if (res.rows && res.rows.length){
        console.log('- [DB DEBUG] Session data found! Will reuse session from data...')
        const sessiondata = {sessionData: `${res.rows[0].sessiondata}`}
        const skipsession = {skipSessionSave: true}
        const assignObj = Object.assign(configObject, sessiondata)
        //const assignObj2 = Object.assign(configObject, skipsession)
      } else {
          console.log('- [DB DEBUG] Session data from db empty! Will reauthenticate session...')
      }
      });
    await new Promise(resolve => setTimeout(resolve, 10000));*/
    const Handler = require("./handler");
    const Client = await create(configObject);

    await Client.onStateChanged(async (state) => {
      if (state === "TIMEOUT" || state === "CONFLICT" || state === "UNLAUNCHED") await Client.forceRefocus();
      console.log("State Changed >", state);
    });

    await Client.onMessage((message) => {
      Handler.messageHandler(Client, message);
    });

    await Client.onButton(buttonResponse => {
      Handler.buttonHandler(Client, buttonResponse);
    });

    await Client.onGlobalParticipantsChanged((event) => {
      Handler.globalParticipantsChanged(Client, event);
    });

    await Client.onAddedToGroup((event) => {
      Handler.addedToGroup(Client, event);
    });

    await Client.onIncomingCall(async (call) => {
      const { peerJid } = call;
      //await Client.contactBlock(peerJid);
      await Client.sendText(peerJid, "_⚠️ Bot lagi sibuk, jangan Telpon oey!_");
    });
  } catch (err) {
    console.log(err.stack)
  }
};
startBot();
