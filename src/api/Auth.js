import Keychain from 'react-native-keychain';

import * as API from "./apis";

class Auth {
    #key = "";
    #authToken = "";
    #isLogined = false;
    #userData = {};
    #userImage = "";

    constructor() { }

    get userData() {
        return this.#userData;
    }

    get userImage() {
        return this.#userImage;
    }

    // get scoreList() {
    //     return this.scoreList;
    // }

    get isLogined() {
        return this.#isLogined;
    }

    async getCaptcha() {
        try {
            this.#authToken = (await API.getLoginInfo()).authToken;
        } catch (err) {
            if (err.message === "Network request failed") {
                return new Error([ErrorCode.ERR_NET]);
            }
        }

        if (!this.#authToken) {
            return new Error([ErrorCode.ERR_RICH_LIMIT]);
        }

        return "data:image/png;base64," + await API.getLoginCaptcha(this.#authToken).then(e => e.base64());
    }

    async getUserInfoShort() {
        if (!Object.keys(this.#userData)) return this.#userData;
        if (!this.#isLogined) return new Error([ErrorCode.ERR_NOT_LOGIN]);

        return this.#userData = (await API.getUserInfoShort(this.#key)).data;
    }

    async getUserImage() {
        if (this.#userImage) return this.#userImage;
        if (!this.#isLogined) return new Error([ErrorCode.ERR_NOT_LOGIN]);

        return this.#userImage = (await API.getUserInfo(this.#key)).data.profileImg;
    }

    callAPI(apiFunction, ...args) {
        return apiFunction.call(this, ...[this.#key, ...args]);
    }

    async login(username, password, captcha, saveAccount = true) {
        if (!this.#authToken) {
            return false;
        }

        let d = await API.login(this.#authToken, username, password, captcha);
        console.log(d)
        if (!d.authtoken) {
            return new Error([ErrorCode.ERR_RESPOND, d.serverMessage ?? d.message]);
        }

        this.#isLogined = true;
        this.#key = d.authtoken;
        this.#authToken = "";

        await Promise.all([this.getUserInfoShort(), this.getUserImage()]);

        if (saveAccount) Keychain.setGenericPassword(username, password);

        return true;
    }

    logout() {
        this.#authToken = "";
        this.#key = "";
        this.#userData = {};
        this.#userImage = "";
        this.#isLogined = false;

        Keychain.resetGenericPassword();

        return true;
    }
}

export const ErrorCode = {
    ERR_NET:        1 << 0,
    ERR_RICH_LIMIT: 1 << 1,
    ERR_RESPOND:    1 << 2,
    ERR_NOT_LOGIN:  1 << 3,
}

export default new Auth();