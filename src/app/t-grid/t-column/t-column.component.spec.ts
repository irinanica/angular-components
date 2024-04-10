import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TColumnComponent } from './t-column.component';

describe('TColumnComponent', () => {
  let component: TColumnComponent<any>;
  let fixture: ComponentFixture<TColumnComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TColumnComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.name).toBe('');
    expect(component.sortable).toBeTrue();
    expect(component.property).toBeUndefined();
  });

  it('should correctly accept input values', () => {
    component.name = 'Test Column';
    component.sortable = false;
    component.property = 'testProperty';

    expect(component.name).toEqual('Test Column');
    expect(component.sortable).toBeFalse();
    expect(component.property).toEqual('testProperty');
  });
});
