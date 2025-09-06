import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ArticleHead} from '../../../utils/types';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnChanges {
  monthNames: string[] = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  //Data
  @Input() isLoading: Boolean = false;
  @Input() articles: ArticleHead[] | undefined | null;
  placeholders = Array(3);
  empty = false;
  sortedKeys: string[] = [];
  groupedArticles: { [key: string]: ArticleHead[] } = {};

  //Click
  @Output() articleClick: EventEmitter<string> = new EventEmitter();

  ngOnChanges(_changes: SimpleChanges): void {
    this.groupedArticles = this.groupByDate(this.articles ?? []);
    this.empty = (this.articles?.length ?? 0) === 0;
    if (!this.empty) this.sortedKeys = Object.keys(this.groupedArticles).sort((a, b) => b.localeCompare(a));
  }

  groupByDate(items: ArticleHead[]): { [key: string]: ArticleHead[] } {
    return items.reduce((groups: any, item) => {
      const date = this.formatDate(new Date(item.created_at));
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = this.monthNames[date.getMonth()]; // Months are 0-based
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  goArticle(articleId: string) {
    this.articleClick.emit(articleId);
  }

}
