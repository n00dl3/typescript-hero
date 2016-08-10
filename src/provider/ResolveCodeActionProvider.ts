import {Logger, LoggerFactory} from '../utilities/Logger';
import {inject, injectable} from 'inversify';
import {CancellationToken, CodeActionContext, CodeActionProvider, Command, Range, TextDocument} from 'vscode';

const unimportedMatcher = /Cannot find(\w|\s)*["'](\w*)["']/g;

@injectable()
export class ResolveCodeActionProvider implements CodeActionProvider {
    private logger: Logger;

    constructor( @inject('LoggerFactory') loggerFactory: LoggerFactory) {
        this.logger = loggerFactory('ResolveCodeActionProvider');
        this.logger.info('Instantiated.');
    }

    provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken): Command[] | Thenable<Command[]> {
        let diagnostics = context.diagnostics.map(o => {
            return {
                code: o.code,
                msg: o.message
            }
        });
        
        this.logger.info('provideCodeActions called', diagnostics);
        return null;
    }
}
