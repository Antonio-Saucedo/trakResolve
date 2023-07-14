import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BugService } from 'src/app/services/bug.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss'],
})
export class ReportBugComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  reportBugForm!: FormGroup;
  isSubmitted = false;
  newReport = false;
  returnUrl = '';

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private bugService: BugService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reportBugForm = this.formBuilder.group({
      summary: ['', [Validators.required, Validators.minLength(10)]],
      link: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  // Form controls
  get fc() {
    return this.reportBugForm.controls;
  }

  new() {
    this.newReport = true;
  }

  submit() {
    this.isSubmitted = true;
    const value1 = '';
    const value2 = false;
    const value3 = <string[]>[];
    if (this.reportBugForm.invalid) {
      return;
    }
    this.bugService
      .reportBug({
        reportedBy: this.userService.currentUserName,
        summary: this.fc.summary.value.toLowerCase(),
        link: this.fc.link.value.toLowerCase(),
        description: this.fc.description.value,
        reproductionFindings: value1,
        developmentFindings: value1,
        message: "Thank you for your report. We will look over the report and update you with our findings.",
        resolved: value2,
        tags: value3,
      })
      .subscribe(() => {
        if (!this.newReport) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.isSubmitted = false;
          this.reportBugForm.reset();
        }
      });
  }
}
