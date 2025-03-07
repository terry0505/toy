import { SocialProvider, UserType } from "@/types/firebase";
import { FirebaseError, initializeApp } from "firebase/app";
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
  updateProfile,
  deleteUser
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs
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
          { merge: true }
        );
      }
    }

    return user;
  } catch (error) {
    // throw error;
    const fbError = error as FirebaseError;
    switch (fbError.code) {
      case "auth/invalid-email":
        toastr.error("유효하지 않은 이메일입니다.");
        break;
      case "auth/user-disabled":
        toastr.error("비활성화된 계정입니다. 관리자에게 문의하세요.");
        break;
      case "auth/user-not-found":
        toastr.error("존재하지 않는 사용자입니다. 이메일을 확인해주세요.");
        break;
      case "auth/missing-password":
        toastr.error("잘못된 비밀번호입니다.");
        break;
      case "auth/invalid-credential":
        toastr.error("유효하지 않은 계정입니다.");
        break;
      case "auth/network-request-failed":
        toastr.error(
          "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
        );
        break;
      case "auth/too-many-requests":
        toastr.error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        break;
      default:
        toastr.error("알 수 없는 오류가 발생했습니다.", fbError.message);
        break;
    }
    return null; // 에러 발생 시 null 반환
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
    const fbError = error as FirebaseError;
    switch (fbError.code) {
      case "auth/email-already-in-use":
        toastr.error("이미 사용 중인 이메일입니다.");
        break;
      case "auth/invalid-email":
        toastr.error("유효하지 않은 이메일입니다.");
        break;
      case "auth/weak-password":
        toastr.error("비밀번호가 너무 약합니다. 6자 이상 입력해주세요.");
        break;
      case "auth/operation-not-allowed":
        toastr.error("현재 이메일/비밀번호로 회원가입이 비활성화되었습니다.");
        break;
      case "auth/network-request-failed":
        toastr.error(
          "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
        );
        break;
      default:
        toastr.error("알 수 없는 오류가 발생했습니다.", fbError.message);
        break;
    }
    return null; // 에러 발생 시 null 반환
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

export async function removeUser(): Promise<void> {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(database, "users", user.uid);
      await deleteDoc(userDocRef);
      await deleteUser(user);
      toastr.success("회원탈퇴가 완료되었습니다.");
    }
  } catch (error) {
    console.error("회원탈퇴 에러 : ", error);
    toastr.error("회원탈퇴 중 문제가 발생했습니다.");
    throw error;
  }
}

export async function getUsers(): Promise<UserType[]> {
  try {
    const userCollection = collection(database, "users"); // 🔹 전체 유저 목록 가져오기
    const userSnapshot = await getDocs(userCollection);

    if (userSnapshot.empty) {
      console.warn("유저 목록이 비어 있습니다.");
      return [];
    }

    const users: UserType[] = userSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...(doc.data() as UserType)
    }));

    console.log("불러온 유저 목록:", users); // 🔹 데이터 로깅

    return users;
  } catch (error) {
    console.error("유저 목록 가져오기 오류:", error);
    return [];
  }
}

export async function getUserById(uid?: string): Promise<UserType | null> {
  if (!uid) return null;

  try {
    const userDocRef = doc(database, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return { uid, ...userDocSnap.data() } as UserType;
    } else {
      return null;
    }
  } catch (error) {
    console.error("유저 정보 가져오기 오류:", error);
    return null;
  }
}
