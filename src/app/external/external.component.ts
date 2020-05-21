import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import * as jsPDF from 'jspdf';

import { ExternalService } from '@app/_services';
import {first} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({ templateUrl: 'external.component.html' })
export class ExternalComponent implements OnInit{

    @ViewChild('content') content: ElementRef;

    count: string;
    results: Observable <any>;

    constructor(private externalService: ExternalService) {}

    ngOnInit() {
        this.externalService.getAll()
            .pipe(first())
            .subscribe(data => {
              this.results = data.results;
              this.count = data.count;
            });
    }

    downloadPdf(){
      const doc = new jsPDF();

      const specialElementHeaders = {
        '#editor': function(element, rendered) {
          return true;
        }
      };
      const content = this.content.nativeElement;

      doc.fromHTML(content.innerHTML, 15, 15, {
        'with': 190,
        'elementHandlers': specialElementHeaders
      });

      doc.save('intell.pdf');
    }

}
