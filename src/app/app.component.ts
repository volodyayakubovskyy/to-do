import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddListItemDialogComponent} from "./add-list-item-dialog/add-list-item-dialog.component";
import {Subject, takeUntil} from "rxjs";
import {StorageInterface} from "./interfaces/storage.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public listItems: StorageInterface[] = [];
  public completedItems: StorageInterface[] = [];


  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly dialog: MatDialog) {
  }

  public ngOnInit(): void {
    Object.keys(localStorage).forEach(data => {
      let storage = {
        key: data,
        date: Date.now(),
        value: localStorage.getItem(data)
      }
      this.listItems.push(storage)
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public openAddListDialog(item: StorageInterface = null): void {
    const dialog = this.dialog.open(AddListItemDialogComponent, {
      disableClose: true,
      data: item
    })

    dialog.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
        if (!!result) {
          if (this.listItems.find(el => el.key === result.key)) {
            this.listItems.splice(this.listItems.findIndex(el => el.key === item.key), 1, result);
            localStorage.setItem(result.key, result.value);
          } else {
            this.setListItems(result);
          }
        }
      }
    )
  }

  public deleteItem(item: StorageInterface): void {
    this.listItems.splice(this.listItems.findIndex(el => el.key === item.key), 1);
    localStorage.removeItem(item.key);
  }

  public completeItem(item: StorageInterface): void {
    this.deleteItem(item);
    this.completedItems.push(item);
  }

  public removeToList(item: StorageInterface): void {
    this.completedItems.splice(this.completedItems.findIndex(el => el.key === item.key), 1);
    this.setListItems(item);
  }

  public trackByFn = (index: number, item: StorageInterface) => item;

  private setListItems(item: StorageInterface): void {
    localStorage.setItem(String(this.listItems.length), item.value);
    this.listItems.push(item);
  }
}
