import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/models/user.class';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  userId = '';
  user: User = new User();

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paraMap => {
      this.userId = paraMap.get('id');
      console.log('got it', this.userId);
      this.getUser();
    })
  }

  getUser(){
    this.firestore
    .collection('users')
    .doc(this.userId)
    .valueChanges()
    .subscribe((user: any) => {
      this.user = new User(user);
      console.log('retrieved', this.user);
    })
  }

  editUserDetail(){
    const dialog = this.dialog.open(DialogEditUserComponent);
    // Damit die Variable nicht weiterhin mit dieser Componente verbunden ist, wird sie
    // in einen new User gegeben und in eine JSON umgewandelt, damit sie entkoppelt sind.
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  editAddress() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  deleteUser(){
    this.firestore
    .collection('users')
    .doc(this.userId)
    .delete();
  }


}
