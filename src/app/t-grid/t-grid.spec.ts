import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TGridComponent } from './t-grid.component';
import { TColumnComponent } from "./t-column/t-column.component";
import { By } from '@angular/platform-browser';
import { SimpleChange } from "@angular/core";
import { Direction } from "../types";

describe('TGridComponent', () => {
  let component: TGridComponent<any>;
  let fixture: ComponentFixture<TGridComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGridComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TGridComponent);
    component = fixture.componentInstance;
    component.data = [{ id: 1, name: 'Test' }, { id: 2, name: 'Test 2' }];
    component.totalSize = 20;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculates total pages on initialization using totalSize and pageSize', () => {
    expect(component.totalPages).toBe(2);
  });

  it('emits paginationChange event on page size change', () => {
    spyOn(component.paginationChange, 'emit');

    const select: HTMLSelectElement = fixture.debugElement.query(By.css('select[name="page-size"]')).nativeElement;
    select.value = select.options[2].value;
    select.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.pageSize).toBe(25);
    expect(component.paginationChange.emit).toHaveBeenCalledWith({ currentPage: 1, pageSize: 25 });
  });

  it('emits sortChange event when sortable column header is clicked', () => {
    component.sortable = true;
    const column: TColumnComponent<any> = new TColumnComponent();
    column.sortable = true;
    column.property = 'name';
    component.columns.reset([column]);
    component.columns.notifyOnChanges();
    fixture.detectChanges();

    spyOn(component.sortChange, 'emit');
    const columnHeader: HTMLElement = fixture.debugElement.query(By.css('th.sortable')).nativeElement;
    columnHeader.click();

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      columnName: 'name',
      direction: Direction.Ascending
    });

    it('updates total pages on totalSize change', () => {
      component.totalSize = 25;
      component.ngOnChanges({
        totalSize: new SimpleChange(null, component.totalSize, false)
      });
      fixture.detectChanges();

      expect(component.totalPages).toBe(3);
    });
  });

  it('changes page correctly when next button is clicked', () => {
    spyOn(component.paginationChange, 'emit');

    component.changePage(2);
    fixture.detectChanges();

    expect(component.currentPage).toBe(2);
    expect(component.paginationChange.emit).toHaveBeenCalledWith({ currentPage: 2, pageSize: 10 });
  });

  it('does not change page when requested page is outside valid range', () => {
    component.changePage(-1);
    expect(component.currentPage).toBe(1);

    component.changePage(component.totalPages + 1);
    expect(component.currentPage).toBe(1);
  });
});
