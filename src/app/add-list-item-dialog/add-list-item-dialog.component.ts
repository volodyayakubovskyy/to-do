import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {StorageInterface} from "../interfaces/storage.interface";

@Component({
  selector: 'app-add-list-item-dialog',
  templateUrl: './add-list-item-dialog.component.html',
  styleUrls: ['./add-list-item-dialog.component.scss']
})
export class AddListItemDialogComponent implements OnInit {
  public itemValue: FormControl;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly dialogRef: MatDialogRef<AddListItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly dialogData: StorageInterface) {
  }

  public ngOnInit(): void {
    this.itemValue = this.formBuilder.control(this.dialogData?.value, Validators.required);
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    this.dialogRef.close({
      key: this.dialogData ? this.dialogData?.key : '',
      date: this.dialogData ? this.dialogData?.date : Date.now(),
      value: this.itemValue.value
    });
  }
}
