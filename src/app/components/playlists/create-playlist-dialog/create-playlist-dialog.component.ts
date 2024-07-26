import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SpotifyService } from '../../../services/spotify.service';
import { PlaylistsService } from '../../../services/playlists.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Playlist, SourceType } from '../../../models/music.model';

@Component({
  selector: 'app-create-playlist-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './create-playlist-dialog.component.html',
  styleUrl: './create-playlist-dialog.component.scss',
})
export class CreatePlaylistDialogComponent implements OnInit{
  createPlaylistFormGroup: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(0), Validators.maxLength(20)],
    ],
    description: [''],
  });

  newPlaylistDestination: SourceType;

  constructor(
    private spotifyService: SpotifyService,
    private playlistsService: PlaylistsService,
    public dialogRef: MatDialogRef<CreatePlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.newPlaylistDestination = data;
  }

  ngOnInit(): void {
      
  }

  createPlaylist(){
    if (this.newPlaylistDestination === SourceType.SPOTIFY){
      this.spotifyService.createPlaylist(
        this.createPlaylistFormGroup.get('name')?.value,
        this.createPlaylistFormGroup.get('description')?.value,
        []
      ).subscribe({
        next: (res)=>{
          console.log(res)
          this.dialogRef.close(true);
        }
      })

    } else if (this.newPlaylistDestination === SourceType.MUSIC_STORE){
      this.playlistsService
        .createNewPlaylist(<Playlist>{
          name: this.createPlaylistFormGroup.get('name')?.value,
          description: this.createPlaylistFormGroup.get('description')?.value,
          songCount: 0,
          source: SourceType.MUSIC_STORE,
          imageUrl:
            '',
          href: '',
        })
        .subscribe({
          next: (res) => {
            console.log(res);
            this.dialogRef.close(true)
          },
        });
    }
  }
}
