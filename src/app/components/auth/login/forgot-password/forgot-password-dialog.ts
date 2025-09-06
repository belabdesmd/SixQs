import {CommonModule} from "@angular/common";
import {Component, inject, OnInit} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'details-dialog',
  templateUrl: './forgot-password-dialog.html',
  styleUrl: './forgot-password-dialog.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIconModule
  ],
})
export class ForgotPasswordDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ForgotPasswordDialog>);

  //Declarations
  emailForm: FormGroup | undefined;
  emailLoading = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  onSubmit() {
    if (this.emailForm!!.valid) {
      this.emailLoading = true;
      this.dialogRef.close(this.emailForm!!.value.password);
    } else {
      this.emailForm!!.markAllAsTouched();
    }
  }
}
