const SteamUser = require('steam-user');
const SteamTotp = require("steam-totp");
const GlobalOffensive = require('globaloffensive');
const config = require("./config.json");

let steam = new SteamUser();
let csgo = new GlobalOffensive(steam);

steam.on("loggedOn", () => {
    // user logged on
});

steam.on("loginKey", () => {
    // user login key created
});

steam.on("user", () => {
    // user is logged in
});

steam.on("appLaunched", async () => {
	// user launched app
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
