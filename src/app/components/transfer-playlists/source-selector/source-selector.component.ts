import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SourceType, TransferSide } from '../../../models/music.model';
import { SpotifyService } from '../../../services/spotify.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TransferPlaylistsService } from '../transfer-playlists.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-source-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './source-selector.component.html',
  styleUrl: './source-selector.component.scss',
})
export class SourceSelectorComponent implements OnInit, OnDestroy {
  @Input() transferSide!: TransferSide;

  @Output() onSelectedSourceChanged = new EventEmitter<SourceType>();

  step: number = 1;
  selectedService!: SourceType;
  otherService!: SourceType;

  subjectSubscription!: Subscription;

  serviceSelectionGroup: FormGroup = this.fb.group({
    apple_music: [''],
    spotify: [''],
    music_store: [''],
  });

  constructor(
    private spotifyService: SpotifyService,
    private transferPlaylistsService: TransferPlaylistsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (this.transferSide === TransferSide.SOURCE) {
      this.subjectSubscription =
        this.transferPlaylistsService.selectedDestination$.subscribe({
          next: (sourceType: SourceType) => {
            this.otherService = sourceType;
          },
        });
    }

    if (this.transferSide === TransferSide.DESTINATION) {
      this.subjectSubscription =
        this.transferPlaylistsService.selectedSource$.subscribe({
          next: (sourceType: SourceType) => {
            this.otherService = sourceType;
          },
        });
    }
  }

  ngOnDestroy(): void {
    if (this.transferSide === TransferSide.SOURCE) {
      this.transferPlaylistsService.selectedSource$.next(SourceType.NONE);
    }
    this.subjectSubscription.unsubscribe();
  }

  onInitialAddClicked() {
    this.step = 1;
  }

  back() {
    this.step--;

    this.onSelectedSourceChanged.emit(SourceType.NONE);

    if (this.transferSide === TransferSide.SOURCE) {
      this.transferPlaylistsService.selectedSource$.next(SourceType.NONE);
    }

    if (this.transferSide === TransferSide.DESTINATION) {
      this.transferPlaylistsService.selectedDestination$.next(SourceType.NONE);
    }
  }

  sourceSelected(sourceType: SourceType) {
    this.step = 2;
    this.selectedService = sourceType;

    if (this.transferSide === TransferSide.SOURCE) {
      this.transferPlaylistsService.selectedSource$.next(this.selectedService);
    }

    if (this.transferSide === TransferSide.DESTINATION) {
      this.transferPlaylistsService.selectedDestination$.next(
        this.selectedService
      );
    }

    this.onSelectedSourceChanged.emit(this.selectedService);
  }

  get SourceType() {
    return SourceType;
  }
}
