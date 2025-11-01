import { makeAutoObservable } from "mobx";
import React from "react";

export default class ModalStore {
    
    constructor() {
        makeAutoObservable(this);
    }
    
    loadingInitial = false;
    modalToShow: React.ReactNode | undefined = undefined;
    // showLoginModal = false;
    showModal = (modalToShow: React.ReactNode) => {
        this.modalToShow = modalToShow;
    }
    closeModal = () => {
        this.modalToShow = undefined;
    }
}