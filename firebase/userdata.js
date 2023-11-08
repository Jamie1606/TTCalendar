import firestore from './firestore';
import { doc, getDocs, getDoc, deleteDoc, collection, addDoc, setDoc, query, where } from "firebase/firestore";

const userRef = collection(firestore, "users");
const userdataRef = collection(firestore, "userdata");

export function getNewUserID() {
    return getDoc(doc(firestore, "users", "nextuserid")).then((snapshot) => snapshot.data());
};

export function getUser(userid) {
    const q = query(userRef, where("userid", "==", userid));
    return getDocs(q).then((snapshot) => snapshot.docs.map((doc) => doc.data()));
}

export function editUser(userObj) {
    const q = query(userRef, where("userid", "==", userObj.userid));
    return getDocs(q)
        .then((snapshot) => {
            setDoc(doc(firestore, "users", snapshot.docs[0].id), userObj);
        });
}

export function checkUserExists(email) {
    const q = query(userRef, where("email", "==", email));
    return getDocs(q).then((snapshot) => snapshot.docs.map((doc) => doc.data()));
}

export function refreshUserID(userid) {
    return setDoc(doc(firestore, "users", "nextuserid"), {
        nextid: userid
    });
}

export function addUser(userObj) {
    return addDoc(userRef, userObj);
};

export function getUserData(userid) {
    const q = query(userdataRef, where("userid", "==", userid));
    return getDocs(q).then((snapshot) => snapshot.docs.map((doc) => doc.data()));
}

export function refreshUserDataID(userdataid) {
    return setDoc(doc(firestore, "userdata", "nextdataid"), {
        nextid: userdataid
    });
}

export function getUserDataNewID() {
    return getDoc(doc(firestore, "userdata", "nextdataid")).then((snapshot) => snapshot.data());
}

export function addUserData(userdata) {
    return addDoc(userdataRef, userdata);
}

export function editUserData(userdata) {
    const q = query(userdataRef, where("id", "==", userdata.id));
    return getDocs(q)
        .then((snapshot) => {
            setDoc(doc(firestore, "userdata", snapshot.docs[0].id), userdata);
        });
}

export function deleteUserData(userdataid) {
    const q = query(userdataRef, where("id", "==", userdataid));
    return getDocs(q)
        .then((snapshot) => {
            deleteDoc(doc(firestore, "userdata", snapshot.docs[0].id));
        })
}