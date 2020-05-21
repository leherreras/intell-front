import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import {Book} from '@app/_models';

@Injectable({ providedIn: 'root' })
export class BookService {
    private bookSubject: BehaviorSubject<Book>;
    public book: Observable<Book>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.bookSubject = new BehaviorSubject<Book>(JSON.parse(localStorage.getItem('book')));
        this.book = this.bookSubject.asObservable();
    }

    public get bookValue(): Book {
        return this.bookSubject.value;
    }

    getAll() {
        return this.http.get<Book[]>(`${environment.apiUrl}/book/`);
    }

    getById(id: string) {
        return this.http.get<Book>(`${environment.apiUrl}/book/${id}`);
    }

    add(book: Book) {
        const body = new FormData();
        Object.keys(book).forEach((key) => {body.append(key, book[key]); });
        return this.http.post(`${environment.apiUrl}/book/`, body);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/book/${id}`, params)
            .pipe(map(x => {
                // update stored book if the logged in book updated their own record
                if (id === this.bookValue.id) {
                    // update local storage
                    const book = { ...this.bookValue, ...params };
                    localStorage.setItem('book', JSON.stringify(book));

                    // publish updated book to subscribers
                    this.bookSubject.next(book);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/book/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }
}
