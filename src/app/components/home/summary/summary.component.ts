import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {CitationsDialog} from "./citations/citations-dialog";
import {MatDialog} from "@angular/material/dialog";
import {DetailsDialog} from "./details/details-dialog";
import {Article, DetailedSummary} from '../../../utils/types';
import {WikipediaService} from '../../../services/wikipedia.service';

@Component({
  selector: 'app-summary',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnChanges {
  //Data
  @Input() article: Article | undefined | null;

  //Click
  @Output() articleDismissedClick: EventEmitter<void> = new EventEmitter();

  //Data
  summaries: any[] = [];
  currentIndex = 0;

  //Dialog
  readonly dialog = inject(MatDialog);

  constructor(private wikipediaService: WikipediaService) {
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.article?.summary != null) this.currentIndex = -1;
    if (this.article != null) this.prepareList(this.article!.detailed_summary)
  }

  prepareList(summary: DetailedSummary) {
    this.summaries = Object.entries(summary).map(([key, value]) => {
      if (value?.length ?? 0 > 0) return {
        question: key.toUpperCase(),
        answer: value
      }; else return null;
    }).filter(item => item !== null);
  }

  showCitations() {
    this.dialog.open(CitationsDialog, {data: this.article?.citations!});
  }

  dismissArticle() {
    this.articleDismissedClick.emit();
  }

  onDefinitionClick(answer: string) {
    const dialogRef = this.dialog.open(DetailsDialog, {data: {isLoading: true, answer: answer}});

    // search answer
    this.wikipediaService.search(answer).subscribe({
      next: (response: any) => {
        dialogRef.componentInstance.updateData({
          isLoading: false,
          answer: answer,
          definition: response.extract
        });
      },
      error: (error: any) => {
        dialogRef.componentInstance.updateData({
          isLoading: false,
          answer: answer,
          error: error
        });
      },
    });
  }

  goToPrevious() {
    if (this.currentIndex > 0 || (this.currentIndex == 0 && this.article?.summary)) {
      this.currentIndex--;
    }
  }

  goToNext() {
    if (this.currentIndex < this.summaries.length - 1) {
      this.currentIndex++;
    }
  }

  isArray(element: any) {
    return Array.isArray(element)
  }

}
