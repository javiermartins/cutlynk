import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlDetailComponent } from './url-detail.component';

describe('UrlDetailComponent', () => {
  let component: UrlDetailComponent;
  let fixture: ComponentFixture<UrlDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UrlDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
