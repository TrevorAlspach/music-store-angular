import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  constructor(private authService: AuthService, private songService: SongService, private router: Router){}

  hitapi(){
    return this.songService.findSongByNmae('name').subscribe({
      next: (res)=>{
        console.log(res)
      }
    })
  }

  logout(){
    this.authService.logout().subscribe({
      next: (res)=>{
        console.log(res);
        this.router.navigate(["/login"]);
      }
    })
  }

}
