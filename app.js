const SteamUser = require('steam-user');
const SteamTotp = require("steam-totp");
const GlobalOffensive = require('globaloffensive');
const config = require("./config.json");

let steam = new SteamUser();
let csgo = new GlobalOffensive(steam);

steam.on("error", async (err) => {
	// error occurred
});

steam.on("loggedOn", () => {
    // user logged on
});

steam.on("disconnected", async (eresult, msg) => {
	// steam disconnected
});

steam.on("loginKey", (key) => {
    // user login key created
});

steam.on("user", (sid, user) => {
    // user is logged in
});

steam.on("appLaunched", async (appID) => {
	// user launched app
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

(async () => {
	// Login to an given steam account

    /*///////////////////////////////////
        interface LogOnDetailsNamePass
            accountName: string;
            password: string;
            authCode?: string;
            twoFactorCode?: string;
            rememberPassword?: boolean;
            logonID?: number | string;
            machineName?: string;
            clientOS?: SteamUser.EOSType;
            dontRememberMachine?: boolean;
            autoRelogin?: boolean;
    ///////////////////////////////////*/
    steam.logOn({
        accountName: config.username,
        password: config.password,
        twoFactorCode?: config.secret.length > 5 ? SteamTotp.getAuthCode(secret) : undefined,
		rememberPassword: true
    });
})();
