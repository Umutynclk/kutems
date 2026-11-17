const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, serverTimestamp, getDocs, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBmcEL0rF7Jvplgv0DbL_NLUrp_j5EJ2xI",
  authDomain: "kutems.firebaseapp.com",
  projectId: "kutems",
  storageBucket: "kutems.firebasestorage.app",
  messagingSenderId: "810820213557",
  appId: "1:810820213557:web:1a25ad40de9b809c014a7c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testSubmission() {
  console.log('Testing public customer inquiry submission against Firestore rules...');
  const ref = doc(collection(db, 'requests'));
  const testPayload = {
    requestId: 'REQ-TEST-' + Math.floor(1000 + Math.random() * 9000),
    requestType: 'product_inquiry',
    name: 'Test Doğrulama',
    email: 'test@kutems.com',
    phone: '+90 555 123 4567',
    company: 'KUTEMS Test Ltd',
    message: 'Phase 7 otomatik test talebi.',
    articleNumber: '1003B',
    productName: 'Roller 2 inch steel',
    sourcePage: '/hardware/product/1003B',
    locale: 'tr',
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(ref, testPayload);
    console.log('✓ Public request created successfully! Doc ID:', ref.id, 'Request ID:', testPayload.requestId);
  } catch (err) {
    console.error('✗ Submission failed:', err.message);
    process.exit(1);
  }
}

testSubmission();
