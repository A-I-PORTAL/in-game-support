// The code inside the <script> tag in the index.html
// should be moved to a separate script.js file if preferred
// and include the <script type="module" src="script.js"></script> in index.html

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
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

// Login function
loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider);
});

// Logout function
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Auth State Listener
onAuthStateChanged(auth, user => {
    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        forumSection.style.display = 'block';
        loadPosts();
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        forumSection.style.display = 'none';
    }
});

// Load Posts
function loadPosts() {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    onSnapshot(q, snapshot => {
        postsDiv.innerHTML = '';
        snapshot.forEach(doc => {
            const post = document.createElement('div');
            post.textContent = doc.data().text;
            postsDiv.appendChild(post);
        });
    });
}

// Post function
postBtn.addEventListener('click', () => {
    const text = postInput.value;
    if (text.trim()) {
        addDoc(collection(db, 'posts'), {
            text: text,
            timestamp: serverTimestamp(),
            user: auth.currentUser.displayName,
            userId: auth.currentUser.uid
        });
        postInput.value = '';
    }
});
