export interface LoginInfo {
    username: string;
    password: string;
}

export interface LoginResponse {
    _id?: string;
    // errCode?: number;
    loginName?: string;
    loginSucceed: boolean;
    reason?: string;
}