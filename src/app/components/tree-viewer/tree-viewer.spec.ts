import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewer } from './tree-viewer';

describe('TreeViewer', () => {
  let component: TreeViewer;
  let fixture: ComponentFixture<TreeViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
