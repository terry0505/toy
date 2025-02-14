import { SocialProvider } from "@/types/firebase";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  updateProfile
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import toastr from "toastr";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getFirestore(app);

export const socialLogin =
  (type: SocialProvider) => async (): Promise<User | null> => {
    try {
      let provider = null;
      if (type === "google") {
        provider = new GoogleAuthProvider();
      } else if (type === "github") {
        provider = new GithubAuthProvider();
      } else if (type === "facebook") {
        provider = new FacebookAuthProvider();
      }

      if (!provider) {
        toastr.error("지원되지 않는 소셜 로그인 제공자입니다.");
        return null;
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userDocRef = doc(database, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName || null,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
        }
      }

      return user;
    } catch (error) {
      // 코드 생략...
    }
  };

export const login = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (user) {
      const userDocRef = doc(database, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || null,
          lastLogin: new Date().toISOString()
        });
      } else {
        await setDoc(
          userDocRef,
          {
            lastLogin: new Date().toISOString()
          },
          { merge: true } // 기존 데이터에 병합
        );
      }
    }

    return user;
  } catch (error) {
    // 코드 생략...
  }
};

export const signup = async (
  email: string,
  password: string,
  nickname?: string
): Promise<User | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (nickname && user) {
      await updateProfile(user, { displayName: nickname });
    }

    await setDoc(doc(database, "users", user.uid), {
      email: user.email,
      displayName: nickname || null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });

    return user;
  } catch (error) {
    // 코드 생략 ...
  }
};

export async function logout(): Promise<void> {
  try {
    const user = auth.currentUser;
    if (user) {
      const sessionRef = doc(database, "sessions", user.uid);
      await deleteDoc(sessionRef);
    }

    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 에러 : ", error);
    throw error;
  }
}

async function getUserDataFromFirestore(uid: string) {
  const userDocRef = doc(database, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return { uid, ...userDocSnap.data() };
  } else {
    return null;
  }
}

export function onUserStateChange(callback: (user: User | null) => void): void {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = await getUserDataFromFirestore(user.uid);
      callback(userData ? { ...user, ...userData } : user);
    } else {
      callback(null);
    }
  });
}

export const fetchUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    onUserStateChange((user) => resolve(user));
  });
};
