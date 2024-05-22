import { Component } from '@angular/core';
import { Router } from '@angular/router';

// import * as firebase from 'firebase/app'; // Import Firebase
// import {
//   getAuth,
//   signInWithPopup,
// } from 'firebase/auth'; // Import the getAuth function
import { MatSnackBar } from '@angular/material/snack-bar';
const environement = "http://localhost:8000"
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

constructor(
  // private authService: AuthService, to create later to night 
  private router: Router,
  private _snackBar: MatSnackBar
) {
  // NOt working gotta check later but not important for now !!!
  // const app = firebase.initializeApp(environment.firebaseConfig);
  // this.auth = getAuth(app);
}
ngOnInit() {
  sessionStorage.clear();
}
// Méthode de connexion avec email et mot de passe
login(email: string, password: string) {
  console.log(" I am here mdafack ");

  // create the serviceeeeeee later
  // this.authService.login(email, password).subscribe({
  //   next: (response: any) => {
  //     if (response.message === 'Login successfull') {
  //       window.sessionStorage.setItem(
  //         'userInfo',
  //         JSON.stringify(response.user)
  //       );

  //       localStorage.setItem('activeButton', 'home');
  //       if (!response.user.isRegistrationComplete) {
  //         sessionStorage.setItem(
  //           'registrationStep',
  //           response.user.registrationStep
  //         );
  //         this.router.navigateByUrl('/sign-in');
  //       } else {
  //         sessionStorage.setItem('sessionActive', 'true');
  //         this.router.navigateByUrl('/main');
  //       }
  //       if (response.user.isAdmin) this.router.navigateByUrl('/adminUsers');
  //     }
  //   },
  //   error: (error: any) => {
  //     console.error('Login failed :', error.error.message);
  //     this._snackBar.open(error.error.message, 'Fermer', {
  //       duration: 5000,
  //     });
  //   },
  // });
}

}