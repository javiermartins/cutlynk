import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUrlComponent } from './new-url.component';

describe('NewUrlComponent', () => {
  let component: NewUrlComponent;
  let fixture: ComponentFixture<NewUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUrlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
