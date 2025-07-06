import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeViewer } from './tree-viewer';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

describe('TreeViewer', () => {
  let component: TreeViewer;
  let fixture: ComponentFixture<TreeViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeViewer],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
