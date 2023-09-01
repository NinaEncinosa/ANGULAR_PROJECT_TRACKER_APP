import { Item } from "./item.model";

export class Epic extends Item {

    private _project: string;
    private _icon: string;

    constructor(name: string, description: string, project: string, icon: string, _id: string) {
        super(name, description, _id);
        this._project = project;
        this._icon = icon;
    }

    get project(): string {
        return this._project;
    }

    get icon(): string {
        return this._icon;
    }

    set project(project: string) {
        this._project = project;
    }

    set icon(icon: string) {
        this._icon = icon;
    }

}
