import { getFirestore } from '@firebase/firestore';

import app from './firebase';

// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(app);

export default firestore;