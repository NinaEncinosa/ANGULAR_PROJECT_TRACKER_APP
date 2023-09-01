import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/modules/models/item.model';

export const LIST_SERVICE_TOKEN = new InjectionToken<ListService<Item>>(
  'LIST SERVICE TOKEN'
);

export abstract class ListService<Item> {
  
  abstract getItems(parentId: string): Observable<Item[]>;

  abstract getAllItems(): Observable<Item[]>;

  abstract getItemById(id: string): Observable<Item>;

  abstract getItemName(id: string): Observable<string>;

  abstract createItem(item: Item): Observable<Item>;

  abstract updateItem(item: Item): Observable<Item | null>;

  abstract deleteItem(id: string): Observable<Item | null>;

  abstract editItem(item: Item): void;
}
