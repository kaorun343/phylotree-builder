import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutModal } from './about-modal';
import { describe, beforeEach, it, expect } from 'vitest';

describe('AboutModal', () => {
  let component: AboutModal;
  let fixture: ComponentFixture<AboutModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
