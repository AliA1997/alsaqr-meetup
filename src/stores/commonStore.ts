import { makeAutoObservable, reaction } from "mobx";
import Auth from "../utils/auth";
import { ServerError } from "typings";
import { UserIpInfo } from "@models/common";
import agent from "@utils/common";
import { store } from ".";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = new Auth().getToken();
  userIpInfo: UserIpInfo | undefined = undefined;
  appLoaded = false;

  alertMessage: string[] = [];
  alertsDisplayed: boolean = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          new Auth().setToken(token);
        } else {
          new Auth().clearToken();
        }
      }
    );

    
  }

  setServerError = (error: ServerError) => {
    this.error = error;
  };

  setToken = (token: string | null) => {
    this.token = token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };

  setUserIpInfo = (data: UserIpInfo | undefined) => {
    this.userIpInfo = data;
  }

  addAlertMessage = (alert: string) => {
    if (!this.alertMessage) this.alertMessage = [];

    this.alertMessage.push(alert);
  };

  loadIpInfo = async () => {
    if(!store.authStore.auth)
      store.authStore.auth = new Auth();

    if(!store.authStore.auth.getUserIpInfo()) {
      const ipData = await agent.locationApiClient.getIpAddress();
      const newUserIpInfo = {
        countryName: ipData.country_name,
        latitude: ipData.latitude,
        longitude: ipData.longitude
      };

      store.authStore.auth?.setUserIpInfo(newUserIpInfo);
      this.setUserIpInfo(newUserIpInfo);
      console.log("user IP DATA:", this.userIpInfo);
    } else {

      this.setUserIpInfo(store.authStore.auth.getUserIpInfo()!);
    }
  }

  loadScriptByURL = (id: string, url: string, callback: () => void) => {
    const isScriptExist = document.getElementById(id);

    if (!isScriptExist) {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.id = id;
      script.onload = function () {
        if (callback) callback();
      };
      document.body.appendChild(script);
    }

    if (isScriptExist && callback) callback();
  };
}