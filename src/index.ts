import { Addon, AddonInitialiser, Condition, ConditionInput, UserInput, UserInputType, Variable } from 'consequences/addons';

import { EventEmitter } from 'events';

export default class BoilerplateInitialiser implements AddonInitialiser {

  public readonly metadata = {
    name: 'A Consequences Addon',
    description: 'Provides some functionality to Consequences',
    supportsMultipleInstances: false,
  };

  public async createInstance(metadata: Addon.Metadata, configOptions?: { [id: string]: any; }): Promise<BoilerplateAddon> {
    return new BoilerplateAddon(metadata);
  }

}

export class BoilerplateAddon implements Addon {

  public readonly metadata: Addon.Metadata;

  private boilerplateVariable: BoilerplateVariable;

  constructor(metadata: Addon.Metadata) {
    this.metadata = metadata;
    this.boilerplateVariable = new BoilerplateVariable();
  }

  public async loadVariables(): Promise<Variable[]> {
    return [this.boilerplateVariable];
  }

}

class BoilerplateVariable extends EventEmitter implements Variable {

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
class BoilerplateCondition implements Condition {

  public readonly uniqueId = 'boilerplate_condition';

  public readonly name = 'Boilerplate Condition for "good_value"';

  public readonly extraInputs = [
    new BoilerplateConditionInput(),
  ];

  public supports(input: any): boolean {
    return typeof input === 'string';
  }

  public evaluate(input: string, userInputs?: UserInput[]): boolean {
    if (userInputs) {
      for (const userInput of userInputs) {
        if (userInput.uniqueId === 'boilerplate_condition_input') {
          if (input === userInput.value) {
            return true;
          }
        }
      }
    }

    return input === 'good_value';
  }

}

/**
 * An extra input the user may provide to also produce a positive
 * match for the passed string
 *
 * @class BoilerplateConditionInput
 * @implements {ConditionInput}
 */
class BoilerplateConditionInput implements ConditionInput {

  public readonly uniqueId = 'boilerplate_condition_input';

  public readonly name = 'Included string';

  public readonly hint = 'A string that will also be matched, along with "good_value"';

  public readonly allowsMultiple = false;

  public readonly optional = true;

  public readonly type = UserInputType.string;

}
