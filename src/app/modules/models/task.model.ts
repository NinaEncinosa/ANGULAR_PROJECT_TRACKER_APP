import { Item } from "./item.model";

export class Task extends Item {

    private _story: string;
    private _created?: Date;
    private _due?: Date;
    private _done?: boolean;

    constructor(name: string, description: string, _id :string, story: string, created?: Date, dueDate?: Date, done?: boolean) {
        super(name, description, _id);
        this._story = story;
        this._created = created || new Date();
        this._due = dueDate;
        this._done = done || false;
    }

    // Getters
    get story(): string {
        return this._story;
    }

    get created(): Date | undefined {
        return this._created;
    }

    get due(): Date | undefined {
        return this._due;
    }

    get done(): boolean | undefined {
        return this._done;
    }

    // Setters
    set story(value: string) {
        this._story = value;
    }

    set created(value: Date | undefined) {
        this._created = value;
    }

    set due(value: Date | undefined) {
        this._due = value;
    }

    set done(value: boolean | undefined) {
        this._done = value;
    }

}