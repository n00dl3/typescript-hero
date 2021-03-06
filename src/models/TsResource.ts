import {TsDeclaration} from './TsDeclaration';
import {TsExport} from './TsExport';
import {TsImport} from './TsImport';
import {parse, ParsedPath} from 'path';
import {workspace} from 'vscode';

// TsSource can be: File, Module, Namespace
// module contains declarations, imports, exports, submodules

export abstract class TsResource {
    public imports: TsImport[] = [];
    public declarations: TsDeclaration[] = [];
    public exports: TsExport[] = [];
    public resources: TsResource[] = [];
    public usages: string[] = [];

    public get nonLocalUsages(): string[] {
        return this.usages.filter(usage => !this.declarations.some(o => o.name === usage) && !this.resources.some(o => o instanceof TsNamedResource && o.name === usage));
    }

    public abstract getIdentifier(): string;
}

export class TsFile extends TsResource {
    public get parsedPath(): ParsedPath {
        return parse(this.filePath);
    }

    constructor(public filePath: string) {
        super();
    }

    public getIdentifier(): string {
        return '/' + workspace.asRelativePath(this.filePath).replace(/([.]d)?[.]ts/g, '');
    }
}

export abstract class TsNamedResource extends TsResource {
    constructor(public name: string) {
        super();
    }

    public getNamespaceAlias(): string {
        return this.name.split(/[-_]/).reduce((all, cur, idx) => {
            if (idx === 0) {
                return all + cur.toLowerCase();
            } else {
                return all + cur.charAt(0).toUpperCase() + cur.substring(1).toLowerCase();
            }
        }, '');
    }

    public getIdentifier(): string {
        return this.name;
    }
}

export class TsModule extends TsNamedResource { }

export class TsNamespace extends TsNamedResource { }
