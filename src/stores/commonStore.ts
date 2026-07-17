import { makeAutoObservable, reaction, runInAction } from "mobx";
import Auth from "../utils/auth";
import { ServerError } from "typings";
import { UserIpInfo } from "@models/common";
import { City } from "@models/city";
import { Topic } from "@models/topic";
import agent from "@utils/api/common";
import { store } from ".";
import LocalStorage from "@utils/localStorage";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = new Auth().getToken();
  userIpInfo: UserIpInfo | undefined = undefined;
  localStorage: LocalStorage | undefined = undefined;
  appLoaded = false;

  alertMessage: string[] = [];
  alertsDisplayed: boolean = false;

  // Selectable cities for the create/update form dropdowns. Loaded once and shared by the
  // event, group, and local-guide forms.
  citiesRegistry = new Map<string, City>();
  loadingCities = false;

  // Selectable topics for the group form's topic autocomplete. Loaded once and shared
  // across forms (see loadTopics).
  topics: Topic[] = [];
  loadingTopics = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.token,
      (token) => {
        this.localStorage = new LocalStorage();
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

  setCities = (cityId: string, city: City) => {
    if(!this.citiesRegistry.has(cityId))
      this.citiesRegistry.set(cityId, city);
  }

  setTopics = (topics: Topic[]) => {
    this.topics = topics;
  }

  // Loads the cities dropdown source once; subsequent callers reuse the cached list.
  loadCities = async () => {
    if (this.citiesRegistry.size > 0 || this.loadingCities) 
      return;
    
    this.loadingCities = true;
    try {
      const cities = await agent.citiesApiClient.getCities();
      runInAction(() => {
          cities.forEach((city: City) => {
              this.setCities(city.id, city);
          });

      });
    } finally {
      runInAction(() => (this.loadingCities = false));
    }
  }


  searchCities = async (query: string): Promise<City[]> => {
    var urlParams = new URLSearchParams();
    urlParams.append("searchTerm", query);

    const results: City[] = await agent.citiesApiClient.searchCities(urlParams);
    runInAction(() => {
      (results ?? []).forEach((c) => this.setCities(c.id, c));
    });
    return results ?? [];
  }

  // Loads the topic autocomplete source once; subsequent callers (each form mount,
  // each keystroke) reuse the cached list so we never re-hit `GET /api/Topics`.
  loadTopics = async () => {
    if (this.topics.length > 0 || this.loadingTopics) return;
    this.loadingTopics = true;
    try {
      const topics = await agent.groupsApiClient.getTopics();
      runInAction(() => this.setTopics(topics ?? []));
    } finally {
      runInAction(() => (this.loadingTopics = false));
    }
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
        locationDisplayName: `${ipData.city}, ${ipData.country_name}`,
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
  }

  get cities() {
    return Array.from(this.citiesRegistry.values());
  }
}