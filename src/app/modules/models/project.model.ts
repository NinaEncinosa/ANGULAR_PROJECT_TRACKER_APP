import { Item } from './item.model';

export class Project extends Item {
  private _members: string[];
  private _icon: string;
  private _owner: string;

  constructor(
    name: string,
    members: string[],
    description: string,
    icon: string,
    _id: string,
    owner: string
  ) {
    super(name, description, _id);
    this._members = members;
    this._icon = icon;
    this._owner = owner;
  }

  get members(): string[] {
    return this._members;
  }

  get icon(): string {
    return this._icon;
  }

  get owner(): string {
    return this._owner;
  }

  set members(members: string[]) {
    this._members = members;
  }

  set icon(icon: string) {
    this._icon = icon;
  }
}
