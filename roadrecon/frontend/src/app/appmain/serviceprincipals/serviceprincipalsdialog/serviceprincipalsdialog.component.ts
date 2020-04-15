import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicePrincipalsItem } from '../../aadobjects.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Location } from '@angular/common';
@Component({
  template: ''
})
export class ServicePrincipalsdialogInitComponent implements OnInit {
  sp: ServicePrincipalsItem;
  myurl: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private location: Location
  ) {
    this.myurl = this.router.url;
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { sp: ServicePrincipalsItem }) => {
        const dialogRef = this.dialog.open(ServicePrincipalsdialogComponent, {
          data: data.sp
        });
        dialogRef.afterClosed().subscribe(result => {
          if(this.router.url == this.myurl){
            this.location.back();
          }
        });
      });
  }

}

@Component({
  selector: 'app-serviceprincipalsdialog',
  templateUrl: './serviceprincipalsdialog.component.html',
  styleUrls: ['./serviceprincipalsdialog.component.less']
})
export class ServicePrincipalsdialogComponent {
  public displayedColumns: string[] = ['displayName', 'description']
  public displayedColumnsOwners: string[] = ['displayName', 'userPrincipalName']
  public displayedColumnsAppRoles: string[] = ['value','displayName', 'description', 'id', 'allowedMemberTypes']
  public displayedColumnsOAuth2: string[] = ['value', 'userConsentDisplayName','userConsentDescription', 'adminConsentDisplayName', 'adminConsentDescription', 'id', 'type']
  public metadata: object[] = [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    public dialogRef: MatDialogRef<ServicePrincipalsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public sp: ServicePrincipalsItem
  ) {
    if (sp.appMetadata && sp.appMetadata.data.length > 0){
      for( let metadata of sp.appMetadata.data){
        let out = {}
        let innerdata: string;
        let jsondata: object;
        try {
          innerdata = atob(metadata['value'])
          try {
            jsondata = JSON.parse(innerdata);
            out['value'] = jsondata;
            out['isJSON'] = true;
          }
          catch(error){
            out['value'] = innerdata;
            out['isJSON'] = false;
          }
        }
        catch(error) {
          innerdata = metadata['value'];
          out['value'] = innerdata;
          out['isJSON'] = false;
        }
        out['key'] = metadata['key'];
        this.metadata.push(out);
      }
    }
  }
}
