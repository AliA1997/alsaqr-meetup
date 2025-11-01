import Auth from '@utils/auth';
import { DEFAULT_USER_REGISTRATION_FORM } from '@utils/constants';
import { makeAutoObservable } from 'mobx';
import { User, UserRegisterForm } from 'typings';


export default class AuthStore {
  currentSessionUser: User | undefined = undefined;
  auth: Auth | undefined = undefined;
  constructor() {
    this.auth = new Auth();
    makeAutoObservable(this);
  }
  initializeFromStorage = async () => {
    if (!this.auth)
      this.auth = new Auth();

    const loggedInUser = this.auth?.getUser();
    if (loggedInUser) {
      this.setCurrentSessionUser(loggedInUser);
      console.log("Found existing logged in user");
    }
  }
  loadingRegistration: boolean = false;
  loadingUpsert: boolean = false;
  currentStepInUserRegistration: number | undefined = 0;
  currentRegistrationForm: UserRegisterForm = DEFAULT_USER_REGISTRATION_FORM;

  setLoadingRegistration = (val: boolean) => {
    this.loadingRegistration = val;
  }
  setLoadingUpsert = (val: boolean) => {
    this.loadingUpsert = val;
  }
  setCurrentStepInUserRegistration = (val: number | undefined) => {
    this.currentStepInUserRegistration = val;
  }
  setCurrentRegistrationForm = (val: UserRegisterForm) => {
    this.currentRegistrationForm = val;
  }

  setCurrentSessionUser = (currentUserPayload: User | undefined) => {
    this.currentSessionUser = currentUserPayload;
    if(currentUserPayload)
      this.auth?.setUser(currentUserPayload);

  };

  navigateBackToHome = () => {
    window.location.href = `${import.meta.env.VITE_PUBLIC_BASE_URL}/`;
  };

  resetAuthState = () => {
    this.currentSessionUser = undefined;
  };
  
}
