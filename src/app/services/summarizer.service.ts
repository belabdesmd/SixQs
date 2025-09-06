import {Injectable} from '@angular/core';
import {DataStorageService} from './data-storage.service';
import {Article} from '../utils/types';
import {AuthService} from './auth.service';
import {runFlow} from 'genkit/beta/client';

@Injectable({
  providedIn: 'root'
})
export class SummarizerService {

  constructor(private authService: AuthService, private dataStorageService: DataStorageService) {
  }

  async getArticle(url: string): Promise<{ error?: string, article?: Article }> {
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
      } else this.summarizeArticle(url).then(response => {
        if (response.error) resolve({error: response.error});
        else resolve({article: response.article});
      })
    })
  }

  private async summarizeArticle(url: string): Promise<{ error?: string, article?: Article }> {
    try {
      const response = await runFlow({
        url: 'https://sixqs-api.belfodil.me/', // Replace with your deployed flow's URL
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await this.authService.getIdToken()}`
        },
        input: {userId: await this.authService.getUserId(), url: url},
      });
      if (response.error) return {error: response.error}
      else {
        await this.dataStorageService.saveArticles([response]);
        return {article: response}
      }
    } catch (error) {
      return {error: error!.toString()}
    }
  }

}
