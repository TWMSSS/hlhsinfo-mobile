import { HTTPRequest, JSONHTTP, defaultAPIURL, APIs } from "./httpRequest";
import RNFetchBlob from "rn-fetch-blob";

export const getLoginInfo = async () => {
    return await JSONHTTP(defaultAPIURL + APIs.loginInfo);
}

export const getLoginCaptcha = async (token) => {
    return await RNFetchBlob.config({
        path: RNFetchBlob.fs.dirs.CacheDir + "/captcha.tmp"
    }).fetch("GET", defaultAPIURL + APIs.captcha, {
        authorization: `Bearer ${token}`
    });
}

export const login = async (username, password, captcha, token) => {
    return await JSONHTTP(defaultAPIURL + APIs.login, token, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            captcha
        })
    });
}

export const getUserInfoShort = async (token) => {
    return await JSONHTTP(defaultAPIURL + APIs.userInfoShort, token);
}

export const getUserInfo = async (token) => {
    return await JSONHTTP(defaultAPIURL + APIs.userInfo, token);
}

export const getAllScores = async (token) => {
    return await JSONHTTP(defaultAPIURL + APIs.allScore, token);
}

export const getAllScoresList = async (token) => {
    return await JSONHTTP(defaultAPIURL + APIs.availableScore, token);
}

export const getAllSchedule = async (token) => {
    return await JSONHTTP(defaultAPIURL + APIs.scheduleList, token);
}

export const getScore = async (year, term, times, testID, token) => {
    return await JSONHTTP(defaultAPIURL + APIs.scoreInfo, token, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            year,
            term,
            times,
            testID,
            examName: Math.random().toString()
        })
    });
}

export const getSchedule = async (className, teacher, token) => {
    return await JSONHTTP(defaultAPIURL + APIs.schedule + `?class=${className}&teacher=${teacher}`, token);
}

export const getLack = async (token) => {
    return await JSONHTTP(defaultAPIURL + APIs.lack, token);
}

export const getShared = async (sharedID) => {
    return await JSONHTTP(defaultAPIURL + APIs.sharedScore, undefined, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sharedID
        })
    })
}

export const getRewAndPun = async (token) => {
    return await JSONHTTP(defaultAPIURL + APIs.rewAndPun, token);
}

export const getSharedImage = async (sharedid) => {
    return await RNFetchBlob.fetch("GET", defaultAPIURL + APIs.sharedImg + `?shared=${sharedid}`);
}

export const shareScore = async (year, term, times, testID, token) => {
    return await JSONHTTP(defaultAPIURL + APIs.share, token, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            year,
            term,
            times,
            testID,
            examName: Math.random().toString()
        })
    });
}

export const shareScoreImage = async (year, term, times, testID, token) => {
    return await RNFetchBlob.fetch("POST", defaultAPIURL + APIs.sharedImg, {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
    },
    JSON.stringify({
        year,
        term,
        times,
        testID
    }));
}

export const getNotify = async () => {
    return await JSONHTTP(defaultAPIURL + APIs.notify);
}

export const cleanCache = async (token) => {
    return await HTTPRequest(defaultAPIURL + APIs.cleanCache, {
        method: "GET",
        headers: { authorization: `Bearer ${token}` }
    });
}

export const autoGetCaptcha = async (token) => {
    var data = await getLoginCaptcha(token).then(e => e.path());
    var fm = new FormData();
    fm.append("image", {
        uri: "file://" + data,
        name: "captcha.tmp",
        type: "image/png"
    });

    return new Promise(async (resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;

        const timeout = setTimeout(() => xhr.abort(), 5000);

        xhr.open("POST", "https://captcha.hlhsinfo.ml/detect?key=test");
        xhr.send(fm);

        xhr.onload = () => {
            clearTimeout(timeout);
            resolve(xhr.response);
        };
        xhr.onerror = () => reject();
        xhr.ontimeout = () => reject();
        xhr.onabort = () => reject();
    });
}