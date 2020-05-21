import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { CommentService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private commentService: CommentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            text: ['', Validators.required],
            id_book: ['', Validators.required],
            id_user: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.commentService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.text.setValue(x.text);
                    this.f.id_book.setValue(x.id_book);
                    this.f.created_at.setValue(x.created_at);
                    this.f.id_user.setValue(x.id_user);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true; if (this.isAddMode) {
            this.createComment();
        } else {
            this.updateComment();
        }
    }

    private createComment() {
      this.commentService.add(this.form.value)
      .pipe(first())
      .subscribe(
          data => {
              this.alertService.success('User added successfully', { keepAfterRouteChange: true });
              this.router.navigate(['.', { relativeTo: this.route }]);
          },
          error => {
              this.alertService.error(error);
              this.loading = false;
          });
    }

    private updateComment() {
        this.commentService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update comment successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
