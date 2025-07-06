import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPanel } from './editor-panel';

describe('EditorPanel', () => {
  let component: EditorPanel;
  let fixture: ComponentFixture<EditorPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
