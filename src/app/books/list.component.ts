import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { BookService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    books = null;

    constructor(private bookService: BookService) {}

    ngOnInit() {
        this.bookService.getAll()
            .pipe(first())
            .subscribe(books => this.books = books);
    }

    deleteBook(id: string) {
        const book = this.books.find(x => x.id === id);
        book.isDeleting = true;
        this.bookService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.books = this.books.filter(x => x.id !== id);
            });
    }
}
