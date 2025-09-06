import {CommonModule} from "@angular/common";
import {Component, inject} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'details-dialog',
  templateUrl: './verification-dialog.html',
  styleUrl: './verification-dialog.scss',
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
export class VerificationDialog {
  readonly dialogRef = inject(MatDialogRef<VerificationDialog>);
  data = inject<number>(MAT_DIALOG_DATA);

  updateData(newData: number) {
    this.data = newData;
  }

  closeDialog() {
    this.dialogRef.close(false)
  }

  deleteAccount() {
    this.dialogRef.close(true);
  }
}
