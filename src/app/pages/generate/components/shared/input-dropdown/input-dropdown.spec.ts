import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDropdown } from './input-dropdown';

describe('InputDropdown', () => {
  let component: InputDropdown;
  let fixture: ComponentFixture<InputDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
