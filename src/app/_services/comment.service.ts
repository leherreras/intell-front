import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import {Comment} from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CommentService {
    private commentSubject: BehaviorSubject<Comment>;
    public comment: Observable<Comment>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.commentSubject = new BehaviorSubject<Comment>(JSON.parse(localStorage.getItem('comment')));
        this.comment = this.commentSubject.asObservable();
    }

    public get commentValue(): Comment {
        return this.commentSubject.value;
    }

    getAll() {
        return this.http.get<Comment[]>(`${environment.apiUrl}/book/comment/`);
    }

    getById(id: string) {
        return this.http.get<Comment>(`${environment.apiUrl}/book/comment/${id}`);
    }

    add(comment: Comment) {
        const body = new FormData();
        Object.keys(comment).forEach((key) => {body.append(key, comment[key]); });
        return this.http.post(`${environment.apiUrl}/book/comment/`, body);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/book/comment/${id}`, params)
            .pipe(map(x => {
                // update stored comment if the logged in comment updated their own record
                if (id === this.commentValue.id) {
                    // update local storage
                    const comment = { ...this.commentValue, ...params };
                    localStorage.setItem('comment', JSON.stringify(comment));

                    // publish updated comment to subscribers
                    this.commentSubject.next(comment);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/book/comment/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }
}
