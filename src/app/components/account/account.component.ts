import {Component, inject, OnInit} from '@angular/core';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {Router} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from "@angular/material/dialog";
import {VerificationDialog} from "./verification/verification-dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PasswordDialog} from "./password/password-dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {Account} from '../../utils/types';
import {AuthService} from '../../services/auth.service';
import {DataStorageService} from '../../services/data-storage.service';

@Component({
  selector: 'app-account',
  imports: [
    MatButton,
    MatToolbar,
    MatIcon,
    MatMiniFabButton,
    MatTooltipModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  // Data
  accountDetails: Account | undefined;

  //Dialog
  readonly dialog = inject(MatDialog);

  constructor(private router: Router, private authService: AuthService, private dataStorageService: DataStorageService) {
  }

  async ngOnInit(): Promise<void> {
    this.dataStorageService.whenReady().subscribe(async () => {
      this.dataStorageService.getAccount((await this.authService.getUserId())).then(details => {
        this.accountDetails = details;
      });
    });
  }


  getTimeSince(date: Date): string {
    const now = new Date();
    let years = now.getFullYear() - date.getFullYear();
    let months = now.getMonth() - date.getMonth();
    let days = now.getDate() - date.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of the previous month
      days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years > 0 ? years + 'Years, ' : ''}${months > 0 ? months + 'Months, ' : ''}${days > 0 ? days + 'Months' : ''}`;
  }

  async goBack() {
    await this.router.navigate(['/']);
  }

  updatePassword() {
    const dialogRef = this.dialog.open(PasswordDialog);
    dialogRef.afterClosed().subscribe((newPassword) => {
      console.log(newPassword);
      if (newPassword != null) this.authService.updatePassword(newPassword).then(async (response: any) => {
        if (response.error) this._snackBar.open(response.error);
        else {
          await this.authService.logout();
          await this.router.navigate(['login']);
        }
      });
    });
  }

  getCredit() {

  }

  deleteAccount() {
    const dialogRef = this.dialog.open(VerificationDialog);
    dialogRef.componentInstance.updateData(this.accountDetails!.summarizationsLeft);
    dialogRef.afterClosed().subscribe((decision) => {
      if (decision) this.authService.deleteAccount().then(async (response: any) => {
        if (response.error) this._snackBar.open(response.error);
        else await this.router.navigate(['login']);
      })
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['login']);
  }

}
