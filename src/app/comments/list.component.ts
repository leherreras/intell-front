import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CommentService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    comments = null;

    constructor(private commentService: CommentService) {}

    ngOnInit() {
        this.commentService.getAll()
            .pipe(first())
            .subscribe(comments => this.comments = comments);
    }

    deleteComment(id: string) {
        const comment = this.comments.find(x => x.id === id);
        comment.isDeleting = true;
        this.commentService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.comments = this.comments.filter(x => x.id !== id);
            });
    }
}
