import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BugService } from 'src/app/services/bug.service';
import { UserService } from 'src/app/services/user.service';
import { Bug } from 'src/app/shared/models/bug';
import { Names } from 'src/app/shared/interfaces/names';

@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.scss'],
})
export class BugComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  reportBugForm: FormGroup = new FormGroup({
    summary: new FormControl(''),
    link: new FormControl(''),
    description: new FormControl(''),
    reproductionFindings: new FormControl(''),
    developmentFindings: new FormControl(''),
  });
  assignForm: FormGroup = new FormGroup({
    assignTo: new FormControl(''),
  });
  bugTagForm!: FormGroup;
  isSubmitted = false;
  isAssignSubmitted = false;
  isTagSubmitted = false;
  bug: Bug = {
    _id: '',
    reportedBy: '',
    summary: '',
    link: '',
    description: '',
    reproductionFindings: '',
    developmentFindings: '',
    assignedTo: '',
    message: '',
    resolved: false,
    tags: [],
  };
  names: Names[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private bugService: BugService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    let BugObservable: Observable<Bug>;
    activatedRoute.params.subscribe((params) => {
      if (params.id) {
        BugObservable = this.bugService.getById(params.id);
        BugObservable.subscribe((serverBug) => {
          this.bug = serverBug;
          this.initializeReportBugForm();
          this.initializeAssignForm();
        });
      }
    });
    let NamesObservable: Observable<Names[]> = this.userService.getDevTeam();
    NamesObservable.subscribe((serverNames) => {
      const devTeam: Names = { firstName: 'dev', lastName: 'team' };
      const finishedDev: Names = { firstName: 'finished', lastName: 'dev' };
      serverNames.push(devTeam, finishedDev);
      this.names = serverNames;
    });
  }

  initializeReportBugForm() {
    this.reportBugForm.setValue({
      summary: this.bug.summary,
      link: this.bug.link,
      description: this.bug.description,
      reproductionFindings: this.bug.reproductionFindings,
      developmentFindings: this.bug.developmentFindings,
      assignedTo: this.bug.assignedTo,
    });
  }

  initializeAssignForm() {
    this.assignForm.setValue({
      assignTo: this.bug.assignedTo,
    });
  }

  ngOnInit(): void {
    this.assignForm = this.formBuilder.group({
      assignTo: ['', Validators.required],
    });

    this.bugTagForm = this.formBuilder.group({
      tag: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.reportBugForm = this.formBuilder.group({
      summary: ['', [Validators.required, Validators.minLength(10)]],
      link: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      reproductionFindings: [''],
      developmentFindings: [''],
      assignedTo: ['', Validators.required],
    });
  }

  // Form controls
  get fc() {
    return this.reportBugForm.controls;
  }

  get assignfc() {
    return this.assignForm.controls;
  }

  get tagfc() {
    return this.bugTagForm.controls;
  }

  assign() {
    this.isAssignSubmitted = true;
    if (this.assignForm.controls.assignTo.invalid) {
      return;
    }
    this.bugService
      .assign(this.bug._id!, this.assignfc.assignTo.value.toLowerCase())
      .subscribe(() => {
        this.isAssignSubmitted = false;
        this.bug.assignedTo = this.assignfc.assignTo.value.toLowerCase();
        this.initializeAssignForm();
      });
  }

  addTag() {
    this.isTagSubmitted = true;
    if (this.bugTagForm.controls.tag.invalid) {
      return;
    }
    this.bugService
      .addTags(this.bug._id!, this.tagfc.tag.value.toLowerCase())
      .subscribe(() => {
        this.isTagSubmitted = false;
        this.bugTagForm.reset();
      });
  }

  submit() {
    this.isSubmitted = true;
    if (this.reportBugForm.invalid) {
      return;
    }
    let message = this.bug.message;
    if (
      (<HTMLSelectElement>document.getElementById('resolved')).value !=
        this.bug.resolved.toString() &&
      (this.userService.currentUserRole == 'lead' ||
        this.userService.currentUserRole == 'admin')
    ) {
      this.bug.resolved == false
        ? (this.bug.resolved = true)
        : (this.bug.resolved = false);
      message =
        'Thank you for your bug report! We have worked on and fixed the issue that was reported. Let us know if there are any other issues we can help with.';
    } else if (
      (<HTMLSelectElement>document.getElementById('resolved')).value !=
        this.bug.resolved.toString() &&
      this.userService.currentUserRole != 'lead' &&
      this.userService.currentUserRole != 'admin'
    ) {
      this.toastrService.error(
        'Not Authorized',
        'Cannot update resolved status',
        { positionClass: 'toast-error' }
      );
      return;
    }
    this.bugService
      .updateBug(this.bug._id!, {
        reportedBy: this.bug.reportedBy,
        summary: this.fc.summary.value.toLowerCase(),
        link: this.fc.link.value.toLowerCase(),
        description: this.fc.description.value,
        reproductionFindings: this.fc.reproductionFindings.value,
        developmentFindings: this.fc.developmentFindings.value,
        assignedTo: this.fc.assignedTo.value,
        message: message,
        resolved: this.bug.resolved,
        tags: this.bug.tags,
      })
      .subscribe(() => {
        this.isSubmitted = false;
      });
  }
}
