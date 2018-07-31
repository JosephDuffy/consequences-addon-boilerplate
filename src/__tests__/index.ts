import { Addon, UserInput } from 'consequences';
import context from 'jest-context';

import {
    BoilerplateAddon,
    BoilerplateCondition,
    BoilerplateConditionExtraGoodValueInput,
    BoilerplateInitialiser,
    BoilerplateVariable,
} from '../index';

describe('Boilerplate Addon', () => {
    let initialiser: BoilerplateInitialiser;
    let saveData: (data: object) => void;

    beforeEach(() => {
        initialiser = new BoilerplateInitialiser();
        // tslint:disable-next-line:no-empty
        saveData = (data: object) => {};
    });

    context('BoilerplateInitialiser', () => {

        it('should use the metadata passed to the initialiser', async () => {
            const metadata: Addon.Metadata = {
                instanceId: 'FAKE_ID',
                name: 'Template Addon',
                userProvidedInputs: [],
            };

            const instance = await initialiser.createInstance(metadata, saveData);

            expect(instance.metadata).toEqual(metadata);
        });
    });

    context('BoilerplateAddon', () => {
        let instance: BoilerplateAddon;

        const metadata: Addon.Metadata = {
            instanceId: 'FAKE_ID',
            name: 'Template Addon',
            userProvidedInputs: [],
        };

        beforeEach(async () => {
            instance = await initialiser.createInstance(metadata, saveData);
        });

        it('should return one variable', async () => {
            const variables = await instance.variables;

            expect(variables).toHaveLength(1);
        });
    });

    context('BoilerplateVariable', () => {
        let variable: BoilerplateVariable;

        beforeEach(async () => {
            variable = new BoilerplateVariable();
        });

        it('should default to an empty string', async () => {
            const value = await variable.retrieveValue();

            expect(value).toEqual('');
        });

        it('should notify listeners of value changes', async () => {
            const newValue = 'new_value';

            const listener = jest.fn();

            variable.addChangeEventListener(listener);
            await variable.updateValue('new_value');

            expect(listener).toHaveBeenCalledTimes(1);
        });

        it('should not notify listeners that have been removed of value changes', async () => {
            const newValue = 'new_value';

            const listener = jest.fn();

            variable.addChangeEventListener(listener);
            variable.removeChangeEventListener(listener);
            await variable.updateValue('new_value');

            expect(listener).toHaveBeenCalledTimes(0);
        });

        it('should throw when passing in "bad_value"', () => {
            return expect(variable.updateValue('bad_value')).rejects.toBeDefined();
        });
    });

    context('BoilerplateCondition', () => {
        let condition: BoilerplateCondition;
        let userInput: UserInput.Value;

        beforeEach(async () => {
            condition = new BoilerplateCondition();
            userInput = {
                uniqueId: 'boilerplate_condition_user_input',
                value: 'users_input',
            };
        });

        it('should return `false` when the value is not "good_value"', async () => {
            const result = await condition.evaluate([
                userInput,
            ]);

            expect(result).toEqual(false);
        });

        it('should return `true` when the value is "good_value"', async () => {
            userInput.value = 'good_value';
            const result = await condition.evaluate([
                userInput,
            ]);

            expect(result).toEqual(true);
        });

        context('an extra allowed value is passed', () => {
            const extraOkString = 'extra_ok_value';
            let extraInput: UserInput.Value;

            beforeEach(() => {
                extraInput = {
                    uniqueId: new BoilerplateConditionExtraGoodValueInput().uniqueId,
                    value: extraOkString,
                };
            });

            it('should return `true` when the extra allowed value is passed', async () => {
                userInput.value = extraOkString;

                const result = await condition.evaluate([
                    userInput,
                    extraInput,
                ]);

                expect(result).toEqual(true);
            });

            it('should return `false` when a value different to the extra allowed value is passed', async () => {
                userInput.value = 'a_different_string';

                const result = await condition.evaluate([
                    userInput,
                    extraInput,
                ]);

                expect(result).toEqual(false);
            });
        });
    });
});
