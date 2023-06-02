const axios = require("axios");
const reader = require("readline-sync");

let phone = reader.question("Phone number (with +7): ");
let ht_1 = reader.question("HEAD-Token (part 1): ");
let ht_2 = reader.question("HEAD-Token (part 2): ");
let head_token = ht_1 + ht_2;

async function get_authorize_code() {
	const response = await axios.post("https://qiwi.com/oauth/authorize",
		{
			"response_type": "code",
			"client_id": "qiwi_wallet_api",
			"client_software": "WEB v4.96.0",
			"username": phone,
			"scope": "read_person_profile read_balance read_payment_history accept_payments get_virtual_cards_requisites write_ip_whitelist",
			"token": head_token,
			"token_head_client_id": "web-qw"
		},
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": 'token-tail-web-qw=' + ht_2
			}
		}
	);
	return response.data.code;
}

async function get_authorize_token(code) {
	let phone_code = reader.question("QIWI-API code received on number: ");
	const response = await axios.post("https://qiwi.com/oauth/token",
		{
			"grant_type": "urn:qiwi:oauth:grant-type:vcode",
			"client_id": "qiwi_wallet_api",
			"code": code,
			"vcode": phone_code
		},
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": "token-tail-web-qw=%s" % ht_2
			}
		}
	);
	if (response.status == 200 && "access_token" in response.data) {
		return response.data.access_token;
	}
	return undefined;
}

async function create_p2p_merchant_key(token) {
	let keysPairName = reader.question("Name for keys pair: ");
	let notifyUrl = reader.question("Server notifications URL: ");
	const response = await axios.post("https://edge.qiwi.com/widgets-api/api/p2p/protected/keys/create", 
		{
			"keysPairName": keysPairName,
			"serverNotificationsUrl": "https://api.mmoweb.biz/v1/Payment/ipn/qiwi"
		},
		{
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token
			}
		}
	);
	switch (response.status) {
		case 200:
			let keys = response.data['result'];
			console.log('Public P2P-key: ' + keys['publicKey']);
			console.log('Secret P2P-key: ' + keys['secretKey']);
			break;
		case 401:
			console.log('Key has been blocked');
			break;
		case 403:
			console.log('No access');
			break;
		default:
			console.log(response.statusText);
			break;
	}
}

(async() => {
	let code = await get_authorize_code();
	let token = await get_authorize_token(code);
	if (!token) {
		console.log('Произошла ошибка при получении токена!')
		return;
	}
	await create_p2p_merchant_key(token);
})();