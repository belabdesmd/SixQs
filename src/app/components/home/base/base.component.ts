import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-base',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit {

  //Data
  @Input() isLoading: Boolean = false;

  //Form
  urlForm: FormGroup | undefined;

  //Click
  @Output() summarizeClick: EventEmitter<string> = new EventEmitter();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\/?#[\]@!$&'()*+,;=]+$/
    this.urlForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(regex)]],
    });
  }

  onSubmit() {
    this.summarizeClick.emit(this.urlForm!!.value.url);
  }
}
