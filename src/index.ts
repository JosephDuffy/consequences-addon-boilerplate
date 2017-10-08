import { Addon, AddonInitialiser, Condition, UserInput, Variable } from 'consequences';

import { EventEmitter } from 'events';

export class BoilerplateInitialiser implements AddonInitialiser {

  public readonly metadata = {
    name: 'A Consequences Addon',
    description: 'Provides some functionality to Consequences',
    supportsMultipleInstances: false,
  };

  public async createInstance(metadata: Addon.Metadata, saveData: (data: object) => void, savedData?: object): Promise<BoilerplateAddon> {
    return new BoilerplateAddon(metadata);
  }

}

export class BoilerplateAddon implements Addon {

  public readonly metadata: Addon.Metadata;

  private boilerplateVariable: BoilerplateVariable;

  public get variables(): Promise<Variable[]> {
    return Promise.resolve([this.boilerplateVariable]);
  }

  constructor(metadata: Addon.Metadata) {
    this.metadata = metadata;
    this.boilerplateVariable = new BoilerplateVariable();
  }

}

export class BoilerplateVariable extends EventEmitter implements Variable {

  public readonly uniqueId = 'boilerplate_variable';

  public readonly name = 'Boilerplate Variable';

  private _currentValue: string;

  constructor() {
    super();

    this._currentValue = '';
  }

  public async retrieveValue(): Promise<string> {
    return this._currentValue;
  }

  public addChangeEventListener(listener: () => void) {
    super.addListener('valueChanged', listener);
  }

  public removeChangeEventListener(listener: () => void) {
    super.removeListener('valueChanged', listener);
  }

  public async updateValue(newValue: string) {
    if (newValue === 'bad_value') {
      throw new Error(`The string "bad_value" is not supported!`);
    }

    this._currentValue = newValue;
    this.emit('valueChanged');
  }

}

/**
 * A simple condition that evaluates if the string equals "good_value", or
 * any of the values provided by the user
 *
 * @class BoilerplateCondition
 * @implements {Condition}
 */
export class BoilerplateCondition implements Condition {

  public readonly uniqueId = 'boilerplate_condition';

  public readonly name = 'Boilerplate Condition for "good_value"';

  public readonly inputs = [
    new BoilerplateConditionUserInput(),
    new BoilerplateConditionExtraGoodValueInput(),
  ];

  public async evaluate(inputs: UserInput.Value[]): Promise<boolean> {
    const userInput = inputs.find((input) => input.uniqueId === 'boilerplate_condition_user_input');

    for (const input of inputs) {
      if (input.uniqueId === 'boilerplate_condition_extra_good_value') {
        if (input.value === userInput.value) {
          return true;
        }
      }
    }

    return userInput.value === 'good_value';
  }

}

/**
 * The value to be checked
 *
 * @class BoilerplateConditionInput
 * @implements {ConditionInput}
 */
export class BoilerplateConditionUserInput implements UserInput {

  public readonly uniqueId = 'boilerplate_condition_user_input';

  public readonly name = 'Value to Check';

  public readonly hint = 'A string that will also be matched, along with "good_value"';

  public readonly allowsMultiple = false;

  public readonly required = true;

  public readonly kind = UserInput.Kind.string;

}

/**
 * An extra input the user may provide to also produce a positive
 * match for the passed string
 *
 * @class BoilerplateConditionInput
 * @implements {ConditionInput}
 */
export class BoilerplateConditionExtraGoodValueInput implements UserInput {

  public readonly uniqueId = 'boilerplate_condition_extra_good_value';

  public readonly name = 'Included string';

  public readonly hint = 'A string that will also be matched, along with "good_value"';

  public readonly allowsMultiple = false;

  public readonly required = false;

  public readonly kind = UserInput.Kind.string;

}

export default BoilerplateInitialiser;
