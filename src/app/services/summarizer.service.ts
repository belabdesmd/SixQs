import {Injectable} from '@angular/core';
import {DataStorageService} from './data-storage.service';
import {Article} from '../utils/types';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SummarizerService {

  constructor(private authService: AuthService, private http: HttpClient, private dataStorageService: DataStorageService) {
  }

  async getArticle(url: string): Promise<{error?: string, article?: Article}> {
    return new Promise(async (resolve) => {
      const exists = await this.dataStorageService.articleWithUrlExists(url);
      if (exists) {
        this.dataStorageService.getArticleByUrl(url).then(article => {
          if (article) resolve({article: article});
          else this.summarizeArticle(url).then(response => {
            if (response.error) resolve({error: response.error});
            else resolve({article: response.article});
          })
        });
      }
    })
  }

  private async summarizeArticle(url: string): Promise<{error?: string, article?: Article}> {
    return new Promise((resolve) => {
      // TODO: Use proper URL (deployed one)
      this.http.post('http://127.0.0.1:3400/helloFlow', {userId: this.authService.getUserId(), url: url}, {
        headers: {"Content-Type": "application/json"}
      }).subscribe({
        next: async (response: any) => {
          if (response.error) resolve({error: response.error});
          else {
            await this.dataStorageService.saveArticles([response.article!]);
            resolve({article: response.article})
          }
        },
        error: (error: any) => {
          resolve({error: error.message});
        },
      });
    })
  }

}
