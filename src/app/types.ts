export enum Direction {
  Ascending = 0,
  Descending = 1,
}

export interface PageDetails {
  currentPage: number;
  pageSize: number | null;
}

export interface PersonDetails {
  firstName: string;
  lastName: string;
}

export interface SortDetails<T> {
  columnName: keyof T;
  direction: Direction;
}

