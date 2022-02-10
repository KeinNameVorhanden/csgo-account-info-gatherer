const SteamUser = require('steam-user');
const SteamTotp = require("steam-totp");
const GlobalOffensive = require('globaloffensive');
const config = require("./config.json");

let steam = new SteamUser();
let csgo = new GlobalOffensive(steam);

let logged_in, connected

steam.on("error", async (err) => {
    throw new Error(err)
	// error occurred
    logged_in = false
});

steam.on("loggedOn", () => {
    // user logged on
    logged_in = true
	steam.setPersona(SteamUser.EPersonaState.Invisible);
});

steam.on("disconnected", async (eresult, msg) => {
    console.log("Disconnected with the result", SteamUser.EResult[eresult], (msg ? ("\n", msg) : ""))
	// steam disconnected
    logged_in = false
});

steam.on("loginKey", (key) => {
    // user login key created
	let dataPath = path.join(__dirname, "data");
	if (!fs.existsSync(dataPath)) {
		fs.mkdirSync(dataPath);
	}

    fs.writeFileSync(path.join(dataPath, config.username + ".loginkey"), JSON.stringify({
		loginkey: key,
		account: config.username
	}, null, "\t"));
});

steam.on("user", (sid, user) => {
    // user is logged in
});

steam.on("appLaunched", async (appID) => {
	// user launched app
    if (appID !== 730) return
});

steam.on("appQuit", async (appID) => {
	// user quit app
});

steam.on("accountInfo", async (...data) => {
	// account info was sent
});

steam.on("emailInfo", async (...data) => {
	// email info was sent
});

steam.on("accountLimitations", async (...data) => {
	// account limitation info was sent
});

steam.on("wallet", async (...data) => {
	// wallet info was sent
});

steam.on("licenses", async (...data) => {
	// license info was sent
});

csgo.on("connectedToGC", () => {
    // user connected to the game coordinator
	connected = true
});

csgo.on("disconnectedFromGC", () => {
    // user disconnected from the game coordinator
	connected = false
});

(() => {
	// login to an given steam account
    steam.logOn({
        accountName: config.username,
        password: config.password,
        twoFactorCode?: config.secret.length > 5 ? SteamTotp.getAuthCode(secret) : undefined,
		rememberPassword: true
    });
})();
