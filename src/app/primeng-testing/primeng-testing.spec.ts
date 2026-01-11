import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengTesting } from './primeng-testing';

describe('PrimengTesting', () => {
  let component: PrimengTesting;
  let fixture: ComponentFixture<PrimengTesting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengTesting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengTesting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
