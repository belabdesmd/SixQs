import { Injectable } from '@angular/core';
import {Account, Article} from '../utils/types';

const DB_NAME = 'SixQs.DB';
const DB_VERSION = 1;

const ACCOUNT_STORE = 'accounts';
const ARTICLE_STORE = 'articles';
const ARTICLE_HEAD_STORE = 'articles_head';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private db!: IDBDatabase;

  constructor() {
    this.initDB();
  }

  private initDB(): void {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ACCOUNT_STORE)) {
        db.createObjectStore(ACCOUNT_STORE, {keyPath: 'userId'});
      }
      if (!db.objectStoreNames.contains(ARTICLE_HEAD_STORE)) {
        db.createObjectStore(ARTICLE_HEAD_STORE, {keyPath: 'articleId'});
      }
      if (!db.objectStoreNames.contains(ARTICLE_STORE)) {
        const store = db.createObjectStore(ARTICLE_STORE, {keyPath: 'articleId'});
        store.createIndex('url', 'url', {multiEntry: true});
      }
    };
    request.onsuccess = () => {
      this.db = request.result;
    };
    request.onerror = () => {
      console.error('IndexedDB error');
    };
  }

  saveAccount(account: Account | undefined): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(ACCOUNT_STORE, 'readwrite');
      const store = tx.objectStore(ACCOUNT_STORE);
      store.put(account);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject('Error saving data');
    });
  }

  saveArticles(articles: Article[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(ARTICLE_STORE, 'readwrite');
      const txHead = this.db.transaction(ARTICLE_HEAD_STORE, 'readwrite');
      const headStore = txHead.objectStore(ARTICLE_HEAD_STORE);
      const store = tx.objectStore(ARTICLE_STORE);
      for (const article of articles) {
        store.put(article);
        headStore.put({
          articleId: article.articleId,
          url: article.url,
          title: article.title,
          created_at: article.created_at,
          summarizerIds: article.summarizerIds,
        })
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject('Error saving data');
    });
  }

}
