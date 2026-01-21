import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-6380829884-6516a",
  appId: "1:103681154380:web:ef76eff5c2e953648743e9",
  apiKey: "AIzaSyDDaDDAh7XsVXtcjUlo2De1UE3oNhVxz_M",
  authDomain: "studio-6380829884-6516a.firebaseapp.com",
  storageBucket: "studio-6380829884-6516a.appspot.com",
  messagingSenderId: "103681154380",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
