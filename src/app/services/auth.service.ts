import {Injectable} from '@angular/core';
import {
  createUserWithEmailAndPassword, deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  signInWithEmailAndPassword, Auth
} from '@angular/fire/auth';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from '@angular/fire/firestore';
import {DataStorageService} from './data-storage.service';
import {Account, Article} from '../utils/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private db: Firestore, private dataStorageService: DataStorageService) {
  }

  async register(email: string, password: string) {

    try {
      let userCreds = await createUserWithEmailAndPassword(this.auth, email, password);
      await setDoc(doc(this.db, "users", userCreds.user.uid), {summarizationsLeft: 3, dailySummarization: true});
      await sendEmailVerification(userCreds.user);
      await this.dataStorageService.saveAccount({
        userId: userCreds.user.uid,
        summarizationsLeft: 5
      });
      return {authenticated: true}
    } catch (e: any) {
      return {authenticated: false, error: e.message};
    }
  }

  async login(email: string, password: string) {
    return new Promise(async (resolve) => {
      try {
        let userCreds = await signInWithEmailAndPassword(this.auth, email, password);
        const articles = (await getDocs(query(collection(this.db, "articles"), where("summarizerIds", "array-contains", userCreds.user.uid)))).docs.map(doc => ({articleId: doc.id, ...doc.data()}));
        getDoc(doc(this.db, "users", userCreds.user.uid)).then(async querySnapshot => {
          if (querySnapshot.exists()) await this.dataStorageService.saveAccount({userId: userCreds.user.uid, ...querySnapshot.data()} as unknown as Account);
          else resolve({error: "An error happened while getting Account Details"})
          if (articles && articles.length > 0) await this.dataStorageService.saveArticles(articles as Article[]);
          resolve({authenticated: true});
        }).catch((e: any) => resolve({authenticated: false, error: e}));
      } catch (e: any) {
        resolve({authenticated: false, error: e.message});
      }
    });
  }

  async resetPassword(email: string) {
    return new Promise((resolve) => {
      sendPasswordResetEmail(this.auth, email)
        .then(() => resolve({error: null}))
        .catch(e => resolve({error: e.message}));
    })
  }

  async updatePassword(newPassword: string) {
    try {
      await updatePassword(this.auth.currentUser!, newPassword);
      await updateDoc(doc(this.db, "users", this.auth.currentUser!.uid), {lastTimePasswordUpdate: new Date()});
      return {error: null}
    } catch (e: any) {
      return {error: e.message};
    }
  }

  async deleteAccount() {
    try {
      await deleteUser(this.auth.currentUser!);
      await deleteDoc(doc(this.db, "users", this.auth.currentUser!.uid));
      return {error: null}
    } catch (e: any) {
      return {error: e.message};
    }
  }

  async logout() {
    await this.auth.signOut();
    return;
  }

  async getUserId() {
    return this.auth.currentUser?.uid!
  }
}
