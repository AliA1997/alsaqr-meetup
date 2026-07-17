import { User } from "typings";
import Cookies from "universal-cookie";
import { testAuthUser } from "./testing/testData";
import { UserIpInfo } from "@models/common";

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
    // The session user does NOT fit in a cookie: `User` carries following[],
    // followers[], bookmarks[], reposts[] and likedPosts[], which serializes
    // well past the ~4KB per-cookie limit â€” browsers then drop the cookie
    // silently and the session looks logged-out on refresh. localStorage has
    // no such cap and is independent of supabase, which web3 sessions need.
    setUser(value: User, key: string='user') {
        localStorage.setItem(key, JSON.stringify(value));
    }
    getUser(key: string='user'): User | null {
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        try {
            return JSON.parse(stored) as User;
        } catch {
            localStorage.removeItem(key);
            return null;
        }
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
        return !!this.getUser();
    }
    isTestUser() {
        return (this.isLoggedIn() && this.getUser()?.email === testAuthUser.email)
    }
    clearUser(key: string='user') {
        localStorage.removeItem(key);
        // Drop the legacy cookie copy so a stale one can never win.
        this.cookie.remove(key, { path: '/' });
    }
    clearToken(key: string = 'jwt') {
        this.cookie.remove(key, { path: '/' });
    }
}