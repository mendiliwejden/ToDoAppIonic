import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';

import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userEmail: string;
  allTask = [];
  allTaskDone=[];
  nb:number;

  constructor(
    private angFire : AngularFireDatabase,
    private navCtrl: NavController,
    private authService: AuthenticateService,
   
  ) { }

  ngOnInit() {
   console.log( this.nb=this.allTask.length)

    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })
   
}

  
getTasks() {
  this.angFire.list('Tasks/').snapshotChanges(['child_added']).subscribe(
    (reponse) => {
      console.log(reponse);
      this.allTask = [];
      reponse.forEach( element => {
        //console.log('****', element)
        this.allTask.push({
          key : element.key,
          text : element.payload.exportVal().text,
          date : element.payload.exportVal().date.substring(11, 16),
          checked : element.payload.exportVal().checked
        })

      })
    }
  )
}

getTasksDone() {
  this.angFire.list('Tasks/').snapshotChanges(['child_added']).subscribe(
    (reponse) => {
      console.log(reponse);
      this.allTaskDone = [];
      reponse.forEach( element => {
        //console.log('****', element)
        if (element.payload.exportVal().checked){
        this.allTaskDone.push({
          key : element.key,
          text : element.payload.exportVal().text,
          date : element.payload.exportVal().date.substring(11, 16),
          checked : element.payload.exportVal().checked
        })}

      })
    }
  )
}

goToDonePage() {
  this.navCtrl.navigateForward('/done');
}
goToHomePage() {
  this.navCtrl.navigateForward('/home');
}

}