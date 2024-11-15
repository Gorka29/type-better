import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingPracticeComponent } from './typing-practice.component';

describe('TypingPracticeComponent', () => {
  let component: TypingPracticeComponent;
  let fixture: ComponentFixture<TypingPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingPracticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
