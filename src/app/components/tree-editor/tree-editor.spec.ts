import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeEditor } from './tree-editor';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

describe('TreeEditor', () => {
  let component: TreeEditor;
  let fixture: ComponentFixture<TreeEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeEditor],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
