import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TProgressComponent } from './t-progress.component';
import { SimpleChange } from '@angular/core';

describe('TProgressComponent', () => {
  let component: TProgressComponent;
  let fixture: ComponentFixture<TProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TProgressComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.radius).toEqual(50);
    expect(component.progress).toEqual(0);
    expect(component.color).toEqual('#efefef');
  });

  it('should calculate dashArray and dashOffset based on radius and progress', () => {
    component.radius = 100;
    component.progress = 50;
    component.calculateProgress();

    const expectedCircumference = 2 * Math.PI * 100;
    expect(component.dashArray).toEqual(expectedCircumference);
    expect(component.dashOffset).toEqual(expectedCircumference / 2);
  });

  it('should emit complete event when progress reaches 100', () => {
    spyOn(component.complete, 'emit');

    component.progress = 100;
    component.ngOnChanges({
      progress: new SimpleChange(null, component.progress, false)
    });

    expect(component.complete.emit).toHaveBeenCalled();
  });

  it('should not emit complete event when progress is less than 100', () => {
    spyOn(component.complete, 'emit');

    component.progress = 99;
    component.ngOnChanges({
      progress: new SimpleChange(null, component.progress, false)
    });

    expect(component.complete.emit).not.toHaveBeenCalled();
  });

  it('should update dashOffset when progress changes', () => {
    const initialProgress = 10;
    const newProgress = 50;
    component.radius = 100;
    component.progress = initialProgress;
    component.ngOnChanges({
      progress: new SimpleChange(null, initialProgress, false)
    });

    const initialDashOffset = component.dashOffset!;

    component.progress = newProgress;
    component.ngOnChanges({
      progress: new SimpleChange(initialProgress, newProgress, false)
    });

    expect(component.dashOffset).toBeLessThan(initialDashOffset);
  });

  it('should not allow radius less than 50', () => {
    component.radius = 30;
    expect(component.radius).toEqual(50);
  });

  it('should not allow progress less than 0 or greater than 100', () => {
    component.progress = -10;
    expect(component.progress).toEqual(0);

    component.progress = 150;
    expect(component.progress).toEqual(100);
  });
});
