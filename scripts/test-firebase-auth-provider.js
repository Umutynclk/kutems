const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyBmcEL0rF7Jvplgv0DbL_NLUrp_j5EJ2xI",
  authDomain: "kutems.firebaseapp.com",
  projectId: "kutems",
  storageBucket: "kutems.firebasestorage.app",
  messagingSenderId: "810820213557",
  appId: "1:810820213557:web:1a25ad40de9b809c014a7c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testAuth() {
  console.log('Testing Email/Password provider on project kutems...');
  try {
    // Attempting a sign-in with non-existent user to check if auth service responds
    await signInWithEmailAndPassword(auth, 'probe-check@kutems.com', 'ProbePass123!');
  } catch (err) {
    console.log('Error code:', err.code);
    console.log('Error message:', err.message);
  }
}

testAuth();
