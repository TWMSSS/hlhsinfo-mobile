export const HTTPRequest = async (url, options) => {
    return await fetch(url, options);
}

export const JSONHTTP = async (url, token, options = {
    headers: {}
}) => {
    return await HTTPRequest(url, {
        ...options,
        headers: {
            authorization: token ? `Bearer ${token}` : "",
            ...options?.headers
        }
    }).then(e => e.json());
}

export const defaultAPIURL = global.config.API_URL || "https://hlhsinfo.muisnowdevs.one/api";
export const APIs = {
    // Login APIs
    login: "/login",
    loginInfo: "/getLoginInfo",
    captcha: "/getLoginCaptcha",

    // Data fetch APIs
    userInfo: "/getUserInfo",
    userInfoShort: "/getUserInfoShort",
    availableScore: "/getAvailableScore",
    allScore: "/getAllScores",
    scoreInfo: "/getScoreInfo",
    rewAndPun: "/getRewAndPun",
    lack: "/getLack",
    scheduleList: "/getScheduleList",
    schedule: "/getSchedule",

    // Score sharing APIs
    share: "/shareScore",
    sharedScore: "/getShared",
    sharedImg: "/getScoreImg",

    // Notification
    notify: "/notify",

    // Clean Cache
    cleanCache: "/clearCache"
}