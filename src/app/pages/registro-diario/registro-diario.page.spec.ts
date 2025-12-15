import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroDiarioPage } from './registro-diario.page';

describe('RegistroDiarioPage', () => {
  let component: RegistroDiarioPage;
  let fixture: ComponentFixture<RegistroDiarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDiarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
