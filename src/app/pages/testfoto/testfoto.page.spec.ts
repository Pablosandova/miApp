import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestfotoPage } from './testfoto.page';

describe('TestfotoPage', () => {
  let component: TestfotoPage;
  let fixture: ComponentFixture<TestfotoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestfotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
