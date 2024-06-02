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
firebase.initializeApp(firebaseConfig);

// Initialize FirebaseUI
const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    tosUrl: '',
    privacyPolicyUrl: ''
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const forumSection = document.getElementById('forum');
const postBtn = document.getElementById('post-btn');
const postInput = document.getElementById('post-input');
const postsDiv = document.getElementById('posts');

// Auth State Listener
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById('firebaseui-auth-container').style.display = 'none';
        logoutBtn.style.display = 'block';
        forumSection.style.display = 'block';
        loadPosts();
    } else {
        document.getElementById('firebaseui-auth-container').style.display = 'block';
        logoutBtn.style.display = 'none';
        forumSection.style.display = 'none';
    }
});

// Logout function
logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut();
});

// Load Posts
function loadPosts() {
    const db = firebase.firestore();
    const q = db.collection('posts').orderBy('timestamp', 'desc');
    q.onSnapshot(snapshot => {
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
        const db = firebase.firestore();
        db.collection('posts').add({
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: firebase.auth().currentUser.displayName,
            userId: firebase.auth().currentUser.uid
        }).catch(error => console.error("Error adding document:", error));
        postInput.value = '';
    }
});




