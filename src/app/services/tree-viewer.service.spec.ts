import { TestBed } from '@angular/core/testing';
import { TreeViewerService } from './tree-viewer.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';

describe('TreeViewerService', () => {
  let service: TreeViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(TreeViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
