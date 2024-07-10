import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPlaylistsComponent } from './transfer-playlists.component';

describe('TransferPlaylistsComponent', () => {
  let component: TransferPlaylistsComponent;
  let fixture: ComponentFixture<TransferPlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferPlaylistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
