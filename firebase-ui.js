import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import * as firebaseui from "https://cdn.firebase.com/libs/firebaseui/4.8.0/firebaseui.js";

export function loadFirebaseUI(auth) {
    const uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
            GoogleAuthProvider.PROVIDER_ID
        ],
        tosUrl: '',
        privacyPolicyUrl: ''
    };

    const ui = new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', uiConfig);
}
