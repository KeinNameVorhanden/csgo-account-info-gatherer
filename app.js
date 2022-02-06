const SteamUser = require('steam-user');
const GlobalOffensive = require('globaloffensive');

let steam = new SteamUser();
let csgo = new GlobalOffensive(steam);

(async () => {
	// Login to an given steam account
})();
