import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RutinasComponent } from './rutinas.component';

describe('RutinasComponent', () => {
  let component: RutinasComponent;
  let fixture: ComponentFixture<RutinasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RutinasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RutinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
