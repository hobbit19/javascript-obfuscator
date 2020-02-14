import { inject, injectable, } from 'inversify';
import { ServiceIdentifiers } from '../../container/ServiceIdentifiers';

import type { BinaryOperator } from 'estree';

import { TIdentifierNamesGeneratorFactory } from '../../types/container/generators/TIdentifierNamesGeneratorFactory';
import { TStatement } from '../../types/node/TStatement';

import { ICustomNodeFormatter } from '../../interfaces/custom-nodes/ICustomNodeFormatter';
import { ICustomNodeObfuscator } from '../../interfaces/custom-nodes/ICustomNodeObfuscator';
import { IOptions } from '../../interfaces/options/IOptions';
import { IRandomGenerator } from '../../interfaces/utils/IRandomGenerator';

import { AbstractCustomNode } from '../AbstractCustomNode';
import { NodeFactory } from '../../node/NodeFactory';
import { NodeUtils } from '../../node/NodeUtils';

@injectable()
export class BinaryExpressionFunctionNode extends AbstractCustomNode {
    /**
     * @type {BinaryOperator}
     */
    private operator!: BinaryOperator;

    /**
     * @param {TIdentifierNamesGeneratorFactory} identifierNamesGeneratorFactory
     * @param {ICustomNodeFormatter} customNodeFormatter
     * @param {ICustomNodeObfuscator} customNodeObfuscator
     * @param {IRandomGenerator} randomGenerator
     * @param {IOptions} options
     */
    public constructor (
        @inject(ServiceIdentifiers.Factory__IIdentifierNamesGenerator)
            identifierNamesGeneratorFactory: TIdentifierNamesGeneratorFactory,
        @inject(ServiceIdentifiers.ICustomNodeFormatter) customNodeFormatter: ICustomNodeFormatter,
        @inject(ServiceIdentifiers.ICustomNodeObfuscator) customNodeObfuscator: ICustomNodeObfuscator,
        @inject(ServiceIdentifiers.IRandomGenerator) randomGenerator: IRandomGenerator,
        @inject(ServiceIdentifiers.IOptions) options: IOptions
    ) {
        super(
            identifierNamesGeneratorFactory,
            customNodeFormatter,
            customNodeObfuscator,
            randomGenerator,
            options
        );
    }

    /**
     * @param {BinaryOperator} operator
     */
    public initialize (operator: BinaryOperator): void {
        this.operator = operator;
    }

    /**
     * @param {string} nodeTemplate
     * @returns {TStatement[]}
     */
    protected getNodeStructure (nodeTemplate: string): TStatement[] {
        const structure: TStatement = NodeFactory.expressionStatementNode(
            NodeFactory.functionExpressionNode(
                [
                    NodeFactory.identifierNode('x'),
                    NodeFactory.identifierNode('y')
                ],
                NodeFactory.blockStatementNode([
                    NodeFactory.returnStatementNode(
                        NodeFactory.binaryExpressionNode(
                            this.operator,
                            NodeFactory.identifierNode('x'),
                            NodeFactory.identifierNode('y')
                        )
                    )
                ])
            )
        );

        NodeUtils.parentizeAst(structure);

        return [structure];
    }
}
