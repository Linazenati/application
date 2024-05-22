import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  isButtonVisible: boolean = false;
  title = "Planificateur d'horraire de soutenances";
  ngOnInit() {  }

  shouldDisplaySidebar(): boolean {
    const currentRoute = this.router.url;
    return (
      !currentRoute.includes('/login') &&
      !currentRoute.includes('/auth') &&
      !currentRoute.includes('/sign-in')
    );
  }

  toggleSidebar(): void {
    this.isButtonVisible = !this.isButtonVisible;
  }
}
