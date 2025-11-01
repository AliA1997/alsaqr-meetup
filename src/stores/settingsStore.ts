import { makeAutoObservable } from 'mobx';
import { SettingsTabs } from '@models/enums';


export default class SettingsStore {
    constructor() {
        makeAutoObservable(this);
    }
    loadingUpsert: boolean = false;
    currentTabIdx: SettingsTabs = SettingsTabs.PersonalInfo;
    currentStepInUserUpdate: number | undefined = 0;

    setLoadingUpsert = (val: boolean) => {
        this.loadingUpsert = val;
    }
    setCurrentStepInUserUpdate = (val: number | undefined) => {
        this.currentStepInUserUpdate = val;
    };

    setCurrentTabIdx = (val: SettingsTabs) => {
        debugger;
        this.currentTabIdx = val;
    }

}
