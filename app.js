const fs = require("fs");
const path = require("path");
const SteamUser = require('steam-user');
const SteamTotp = require("steam-totp");
const GlobalOffensive = require('globaloffensive');
const config = require("./config.json");

let steam = new SteamUser();
let csgo = new GlobalOffensive(steam);

let data_path = path.join(__dirname, "data");
if (!fs.existsSync(data_path)) {
    fs.mkdirSync(data_path);
}

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
    fs.writeFileSync(path.join(data_path, config.username + ".loginkey"), JSON.stringify({
		login_key: key,
		account: config.username
	}, null, "\t"));
});

steam.on("user", (sid, user) => {
    // user is logged in
	if (sid.accountid !== steam.steamID.accountid)
        return

    if (user.gameid !== "0") 
		return

	steam.gamesPlayed([730]);
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
    // Get login key if we have one
	let loginkey_path = path.join(data_path, config.username + ".loginkey");
	let key_data = fs.existsSync(loginkey_path) ? fs.readFileSync(loginkey_path).toString() : undefined;
	try {
		key_data = key_data ? JSON.parse(key_data) : undefined;
	} catch {
		console.log("Failed to parse login key from previous session.");
	}
	let use_login_key = key_data && key_data.account === config.username;

	// login to an given steam account
    steam.logOn({
		accountName: config.username,
		password: use_login_key ? undefined : config.password,
		twoFactorCode: use_login_key ? undefined : (config.secret && config.secret.length > 5 ? SteamTotp.getAuthCode(config.secret) : undefined),
		loginKey: use_login_key ? key_data.login_key : undefined,
		rememberPassword: true
	});
})();
