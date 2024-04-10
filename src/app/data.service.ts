import { Injectable } from '@angular/core';
import { mockData } from "./mock-data";
import { Direction, PersonDetails, SortDetails } from "./types";
import { delay, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getData(
    page: number = 1,
    pageSize: number = 10,
    sort?: SortDetails<PersonDetails>
  ): Observable<{ data: PersonDetails[], totalSize: number }> {
    let data = [...mockData];

    if (sort) {
      data.sort((firstItem, secondItem) => {
        const firstValue = firstItem[sort.columnName];
        const secondValue = secondItem[sort.columnName];

        if (firstValue < secondValue) {
          return sort.direction === Direction.Ascending ? -1 : 1;
        }

        if (firstValue > secondValue) {
          return sort.direction === Direction.Ascending ? 1 : -1;
        }

        return 0;
      });
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const pagedData = data.slice(startIndex, endIndex);
    const totalSize = data.length;

    return of({ data: pagedData, totalSize }).pipe(
      delay(1000)
    );
  }
}
