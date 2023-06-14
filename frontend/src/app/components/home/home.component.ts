import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { Bug } from 'src/app/shared/models/bug';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  loginForm!: FormGroup;
  isSubmitted = false;

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Form controls
  get fc() {
    return this.loginForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      alert(
        `username: ${this.fc.username.value}, password: ${this.fc.password.value}`
      );
    }
  }
}
