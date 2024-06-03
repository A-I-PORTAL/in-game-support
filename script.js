import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTalPVVePU959aKRxiy145EanVc6ob3dI",
    authDomain: "gamer-support-394c1.firebaseapp.com",
    projectId: "gamer-support-394c1",
    storageBucket: "gamer-support-394c1.appspot.com",
    messagingSenderId: "752562072624",
    appId: "1:752562072624:web:c2cc3560845541e43a91f5",
    measurementId: "G-THD3RTE4NC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const forumSection = document.getElementById('forum');
const postBtn = document.getElementById('post-btn');
const postInput = document.getElementById('post-input');
const postsDiv = document.getElementById('posts');

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Detects the user agent
function isEmbeddedBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /FBAN|FBAV|Instagram|Twitter|Snapchat/i.test(userAgent);
}

// Login function
loginBtn.addEventListener('click', () => {
    if (isEmbeddedBrowser()) {
        alert("Please use a regular browser to log in.");
    } else {
        signInWithRedirect(auth, provider).catch((error) => {
            console.error("Error during sign-in:", error);
        });
    }
});

// Logout function
logoutBtn.addEventListener('click', () => {
    signOut(auth).catch((error) => {
        console.error("Error during sign-out:", error);
    });
});

// Get redirect result
getRedirectResult(auth).then((result) => {
    if (result.user) {
        console.log("User signed in via redirect:", result.user);
    }
}).catch((error) => {
    console.error("Error during getRedirectResult:", error);
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User signed in:", user);
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        forumSection.style.display = 'block';
        loadPosts();
    } else {
        console.log("User signed out");
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        forumSection.style.display = 'none';
    }
});

// Load Posts
function loadPosts() {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
        postsDiv.innerHTML = '';
        snapshot.forEach((doc) => {
            console.log(doc.data());
            const post = document.createElement('div');
            post.textContent = doc.data().text;
            postsDiv.appendChild(post);
        });
    });
}

// Post function
postBtn.addEventListener('click', () => {
    const text = postInput.value;
    const currentUser = auth.currentUser;
    if (currentUser && text.trim()) {
        addDoc(collection(db, 'posts'), {
            text: text,
            timestamp: serverTimestamp(),
            user: currentUser.displayName,
            userId: currentUser.uid
        }).then(() => {
            postInput.value = '';
        }).catch((error) => {
            console.error("Error adding document:", error);
        });
    } else {
        console.error("No user signed in or empty post");
    }
});

