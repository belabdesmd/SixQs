import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'details-dialog',
  templateUrl: './password-dialog.html',
  styleUrl: './password-dialog.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
})
export class PasswordDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PasswordDialog>);
  data = inject<number>(MAT_DIALOG_DATA);

  passwordForm: FormGroup | undefined;
  passwordLoading = false;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [this.confirmPasswordValidator]]
    });
  }

  closeDialog() {
    this.dialogRef.close(null)
  }

  onSubmit(): void {
    if (this.passwordForm!!.valid) {
      this.passwordLoading = true
      this.dialogRef.close(this.passwordForm!!.value.password);
    } else {
      this.passwordForm!!.markAllAsTouched();
    }
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault(); // Prevent form submission
    this.hidePassword = !this.hidePassword;
    this.passwordForm!!.markAsPristine();
  }

  confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.parent?.get('password')?.value === control.parent?.get('confirmPassword')?.value && control.parent?.get('password')?.value != undefined)
      return null;
    else return {passwordNoMatch: true};
  };
}
