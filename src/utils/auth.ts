import { UserIpInfo } from "@models/common";
import { User } from "typings";
import Cookies from "universal-cookie";

export default class Auth {
    private cookie: Cookies;

    constructor(cookie?: Cookies) {
        this.cookie = cookie ?? new Cookies();
    }

    getToken(key: string = 'jwt'): string | null {
        return this.cookie.get(key) || null;
    }

    setToken(value: string, key: string = 'jwt') {
        const expires = new Date();
        expires.setDate(expires.getDate() + 3);
        this.cookie.set(key, value, {
            path: '/',
            expires: expires,
            secure: true,
            sameSite: 'strict',
        });
    }
    setUser(value: User, key: string='user') {
        const expires = new Date();
        expires.setDate(expires.getDate() + 3);
        this.cookie.set(key, JSON.stringify(value), {
            path: '/',
            expires: expires,
            secure: true,
            sameSite: 'strict',
        });
    }
    getUser(key: string='user'): User | null {
        return this.cookie.get(key) ? JSON.parse(JSON.stringify(this.cookie.get(key))) : null;
    }
    setUserIpInfo(value: UserIpInfo, key: string="userIpInfo") {
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        this.cookie.set(key, JSON.stringify(value), {
            path: '/',
            expires: expires,
            secure: true,
            sameSite: 'strict',
        });
    }
    getUserIpInfo(key: string='userIpInfo'): UserIpInfo | null {
        return this.cookie.get(key) ? JSON.parse(JSON.stringify(this.cookie.get(key))) : null;
    }
    isLoggedIn() {
        return !!this.cookie.get('user')
    }
    clearUser() {
        return this.cookie.remove('user');
    }
    clearToken(key: string = 'jwt') {
        this.cookie.remove(key);
    }
}