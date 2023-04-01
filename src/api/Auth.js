import EventEmitter from 'events';
import Keychain from 'react-native-keychain';

import * as API from "./apis";

class Auth {
    #key = "";
    #authToken = "";
    #isLogined = false;
    #userData = {};
    #userImage = "";
    #userScoreList = [];

    event = new EventEmitter();

    constructor() { }

    get userData() {
        return this.#userData;
    }

    get userImage() {
        return this.#userImage;
    }

    get scoreList() {
        return this.#userScoreList;
    }

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

        return "data:image/png;base64," + await this.callAPI(API.getLoginCaptcha).then(e => e.base64());
    }

    async getUserInfoShort() {
        if (!Object.keys(this.#userData)) return this.#userData;
        if (!this.#isLogined) return new Error([ErrorCode.ERR_NOT_LOGIN]);

        return this.#userData = (await this.callAPI(API.getUserInfoShort)).data;
    }

    async getUserImage() {
        if (this.#userImage) return this.#userImage;
        if (!this.#isLogined) return new Error([ErrorCode.ERR_NOT_LOGIN]);

        return this.#userImage = (await this.callAPI(API.getUserInfo)).data.profileImg;
    }

    async getScoreList() {
        if (this.#userScoreList.length > 0) return this.#userScoreList;
        if (!this.#isLogined) return new Error([ErrorCode.ERR_NOT_LOGIN]);

        return this.#userScoreList = (await this.callAPI(API.getAllScoresList)).data;
    }

    async clearCache() {
        if (!this.#isLogined) return new Error([ErrorCode.ERR_NOT_LOGIN]);

        await this.callAPI(API.cleanCache);
        return true;
    }

    callAPI(apiFunction, ...args) {
        return apiFunction.call(this, ...[this.#key || this.#authToken, ...args]);
    }

    async login(username, password, captcha, saveAccount = true) {
        if (!this.#authToken) {
            return false;
        }

        let d = await this.callAPI(API.login, username, password, captcha);
        if (!d.authtoken) {
            return new Error([ErrorCode.ERR_RESPOND, d.serverMessage ?? d.message]);
        }

        this.#isLogined = true;
        this.#key = d.authtoken;
        this.#authToken = "";

        await Promise.all([this.getUserInfoShort(), this.getUserImage()]);

        this.event.emit('login', true);

        if (saveAccount) Keychain.setGenericPassword(username, password);

        return true;
    }

    logout() {
        this.#authToken = "";
        this.#key = "";
        this.#userData = {};
        this.#userImage = "";
        this.#isLogined = false;

        this.event.emit('login', false);

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