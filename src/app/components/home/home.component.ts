import {Component, inject, OnInit} from '@angular/core';
import {MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {Router} from "@angular/router";
import {HistoryComponent} from "./history/history.component";
import {SummaryComponent} from "./summary/summary.component";
import {BaseComponent} from "./base/base.component";
import {Article, ArticleHead} from '../../utils/types';
import {DataStorageService} from '../../services/data-storage.service';
import {AuthService} from '../../services/auth.service';
import {SummarizerService} from '../../services/summarizer.service';

@Component({
  selector: 'app-home',
  imports: [
    MatIconButton,
    MatIconModule,
    MatToolbar,
    HistoryComponent,
    SummaryComponent,
    BaseComponent,
    BaseComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  //Dialog
  readonly dialog = inject(MatDialog);

  //Data
  isEmailVerified: Boolean | undefined;
  historyLoading = true;
  history: ArticleHead[] | undefined = [];
  summarizeLoading = false;
  url: string | undefined;
  article: Article | undefined | null;

  constructor(private router: Router, private dataStorageService: DataStorageService, private authService: AuthService, private summarizerService: SummarizerService) {
  }

  async ngOnInit(): Promise<void> {
    // get history
    this.dataStorageService.getArticles(await this.authService.getUserId()).then(articles => {
      if (articles) this.history = articles;
      this.historyLoading = false;
    });
  }

  async summarizeArticle(url: string) {
    this.summarizeLoading = true;
    this.summarizerService.getArticle(url).then((response) => {
      this.summarizeLoading = false;
      if (response.error != null) this._snackBar.open(response.error);
      else this.article = response.article
    });
  }

  fetchArticle(articleId: string) {
    if (!this.summarizeLoading) this.dataStorageService.getArticleById(articleId).then(article => {
      this.article = article;
    });
  }

  onArticleDismissed() {
    this.article = undefined;
  }

  async goAccount() {
    await this.router.navigate(['account']);
  }

  async reLogin(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['login']);
  }

}
