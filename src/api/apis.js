import { HTTPRequest, JSONHTTP, defaultAPIURL, APIs } from "./httpRequest"

export const getLoginInfo = async () => {
    return await JSONHTTP(defaultAPIURL + APIs.loginInfo);
}

export const getLoginCaptcha = async (token) => {
    return await HTTPRequest(defaultAPIURL + APIs.captcha, {
        headers: {
            authorization: `Bearer ${token}`
        }
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

export const getScore = async (year, term, times, token) => {
    return await JSONHTTP(defaultAPIURL + APIs.scoreInfo, token, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            year,
            term,
            times,
            examName: ""
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
    return await HTTPRequest(defaultAPIURL + APIs.sharedImg + `?shared=${sharedid}`);
}

export const shareScore = async (year, term, times, token) => {
    return await JSONHTTP(defaultAPIURL + APIs.share, token, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            year,
            term,
            times,
            examName: Math.random().toString()
        })
    });
}

export const shareScoreImage = async (year, term, times, token) => {
    return await JSONHTTP(defaultAPIURL + APIs.share, token, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            year,
            term,
            times
        })
    });
}

export const getNotify = async () => {
    return await JSONHTTP(defaultAPIURL + APIs.notify);
}