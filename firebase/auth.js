import AsyncStorage from "@react-native-async-storage/async-storage";

import app from "./firebase";

import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export function createUserCredential(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export function getUserCredential(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}