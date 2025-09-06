import {CommonModule} from "@angular/common";
import {Component, inject} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'details-dialog',
  templateUrl: './citations-dialog.html',
  styleUrl: './citations-dialog.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class CitationsDialog {
  readonly dialogRef = inject(MatDialogRef<CitationsDialog>);
  citations = inject<string[]>(MAT_DIALOG_DATA);

  closeDialog() {
    this.dialogRef.close()
  }
}
