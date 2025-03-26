import { IPost, IUser, SocialProvider } from "@/types/firebase";
import { FirebaseError, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy
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
const postsCollectionRef = collection(database, "posts");

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

export async function removeUser(
  email?: string,
  password?: string
): Promise<void | FirebaseError | boolean> {
  try {
    const user = auth.currentUser;

    if (!user) {
      toastr.error("사용자 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    if (user.providerData[0].providerId === "password") {
      const credential = EmailAuthProvider.credential(email, password);

      try {
        await reauthenticateWithCredential(user, credential);
      } catch (error) {
        const fbError = error as FirebaseError;

        // 인증 오류 처리
        if (fbError.code === "auth/requires-recent-login") {
          toastr.error("회원 탈퇴를 위해 다시 로그인해주세요.");
        } else if (
          fbError.code === "auth/missing-password" ||
          fbError.code === "auth/wrong-password" ||
          fbError.code === "auth/invalid-credential"
        ) {
          toastr.error("비밀번호가 일치하지 않습니다.");
        } else {
          toastr.error(
            "인증 중 오류가 발생했습니다. 다시 시도해주세요.",
            fbError.code
          );
        }
        return fbError; // 인증 실패 시 처리 종료
      }
    }

    const userDocRef = doc(database, "users", user.uid);
    await deleteDoc(userDocRef);

    await deleteUser(auth.currentUser);
    toastr.success("회원 탈퇴가 완료되었습니다.");

    return true;
  } catch (error) {
    const fbError = error as FirebaseError;
    console.error("회원 탈퇴 중 오류 발생 : ", fbError);

    if (fbError.code === "auth/requires-recent-login") {
      toastr.error("회원 탈퇴를 위해 다시 로그인해주세요.");
    } else {
      toastr.error("회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
    }

    return fbError;
  }
}

// 코드 생략

export async function getUsers(): Promise<IUser[]> {
  const usersCollectionRef = collection(database, "users");
  const usersSnapshot = await getDocs(usersCollectionRef);

  const users = usersSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      // ...doc.data(),
      email: data.email || "",
      createdAt: data.createdAt || null,
      displayName: data.displayName || null,
      lastLogin: data.lastLogin || null
    };
  });

  return users;
}

export async function getUser(userId: string) {
  try {
    const userDocRef = doc(database, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // console.log('Document data:', userDocSnap.data());
      return userDocSnap.data();
    } else {
      toastr.error("해당 데이터를 찾을 수 없습니다.");
      return null;
    }
  } catch (error) {
    console.error("getUsers Error : ", error);
    throw error;
  }
}

// 게시글 추가
export const addPost = async (title: string, content: string) => {
  const user = auth.currentUser;

  return await addDoc(postsCollectionRef, {
    title,
    content,
    createdAt: new Date(),
    ...(user && { author: user.uid }) // user가 있으면 author 필드 추가
  });
};

// 게시글 조회
export const getPosts = async () => {
  const q = query(postsCollectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const realPosts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  // mock 데이터 추가
  if (process.env.NODE_ENV === "development") {
    const mockPosts = Array.from({ length: 40 }, (_, i) => ({
      id: `mock-${i + 1}`,
      title: `Mock Post Title ${i + 1}`,
      createdAt: {
        seconds: Math.floor(Date.now() / 1000) - i * 86400
      }
    }));

    return [...realPosts, ...mockPosts];
  }

  return realPosts;
};

// 게시글 보기
export const getPostById = async (postId): Promise<IPost> => {
  const postRef = doc(database, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
    return { id: postSnap.id, ...postSnap.data() } as IPost;
  } else {
    throw new Error("글을 찾을 수 없습니다.");
  }
};

// 게시글 수정
export const updatePost = async (
  id: string,
  title: string,
  content: string
) => {
  const postRef = doc(database, "posts", id);
  return await updateDoc(postRef, { title, content });
};

// 게시글 삭제
export const deletePost = async (id: string) => {
  const postRef = doc(database, "posts", id);
  return await deleteDoc(postRef);
};
