export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  token:string;
  isActivated:boolean;
  isConnected: boolean;
  isAdmin: boolean;
}



export interface Client {
  userID:number;
  birthDate: string;
  city: string;
  description: string;
  picture: string;
  status:string;
  registrationStep:string;
}

export interface Admin {
  isSuperAdmin: boolean;
  user: User;
}

export interface Interest {
  interestID:number;
  interestName:string
  
}

export interface Search {
  rechercheID:number;
  rechercheName:string
  
}
export interface Contact {
  contactType: string;
  contactValue: string;
  revealAlways: boolean;
}

export interface ClientQuestion {
  userID: number;
  questionText: string;
  answer: string;
}

export interface ClientCompany {
  userID: number;
  companyName: string;
  projectStatus: string;
  industrySectors:string;
  jobTitle:string;
  jobDescription:string;
  startDate:string;
  picture:string;

}


// export enum Privileges {
//   superAdmin = 0,
//   admin = 1,
// Maybe more privileges ???
// }
