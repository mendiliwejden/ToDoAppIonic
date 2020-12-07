import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {AuthenticateService} from '../services/authentication.service'
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-done',
  templateUrl: './done.page.html',
  styleUrls: ['./done.page.scss'],
})
export class DonePage implements OnInit {
  currentDate : string;
  newTask : string = '';
  allTask = [];
  userUid:string;
  userEmail: string;
  nb : number;

  constructor(private angFire : AngularFireDatabase,
    private authService: AuthenticateService,
     private navCtrl: NavController,
     
   
     ) {
    let myDate = new Date();
    let options = {weekday : 'long', month :'long', day : 'numeric' }
    this.currentDate = myDate.toLocaleDateString('en-en', options)
  
  }

 
  ngOnInit() {

    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
       this.userUid= res.uid ;
      
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })
    this.getTasks();
    
  }


  
  addNewTask() {
    this.angFire.list('Tasks/').push({
      text : this.newTask,
      userId: this.userUid,
      date : new Date().toISOString(),
      checked : false,
      
    });
    this.newTask = '';
    console.log(this.newTask);
  }

  getTasks() {
    this.angFire.list('Tasks/').snapshotChanges(['child_added']).subscribe(
      (reponse) => {
        console.log(reponse);
        this.allTask = [];
        reponse.forEach( element => {
          //console.log('****', element)
          if (element.payload.exportVal().checked){
          this.allTask.push({
            key : element.key,
            text : element.payload.exportVal().text,
            date : element.payload.exportVal().date.substring(11, 16),
            checked : element.payload.exportVal().checked
          })}

        })
      }
    )
  }

  logout() {
    this.authService.logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      })
  }
  
}
