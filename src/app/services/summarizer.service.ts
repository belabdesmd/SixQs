import {Injectable} from '@angular/core';
import {DataStorageService} from './data-storage.service';
import {Article} from '../utils/types';

@Injectable({
  providedIn: 'root'
})
export class SummarizerService {

  constructor(private dataStorageService: DataStorageService) {
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
    // TODO: properly fetch article
    const response: {error?: string, article?: Article} = {error: "this is an error"}
    if (response.error) return {error: response.error};
    else {
      await this.dataStorageService.saveArticles([response.article!]);
      return {article: response.article}
    }
  }

}
