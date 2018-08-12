import {vec3} from '../../global';
import {Tw2CurveSequencer } from './Tw2CurveSequencer';

/**
 * Tw2VectorSequencer
 *
 * @property {string} name
 * @property {number} start
 * @property {vec3} value
 * @property {number} operator
 * @property {Array.<Tw2Curve>} functions
 * @class
 */
export class Tw2VectorSequencer extends Tw2CurveSequencer
{
    constructor()
    {
        super();
        this.start = 0;
        this.value = vec3.create();
        this.operator = 0;
        this.functions = [];
    }

    /**
     * Sorts the sequencer
     */
    Sort()
    {
        Tw2CurveSequencer.Sort(this);
    }

    /**
     * Gets sequencer length
     * @returns {number}
     */
    GetLength()
    {
        let len = 0;
        for (let i = 0; i < this.functions.length; ++i)
        {
            if ('GetLength' in this.functions[i])
            {
                len = Math.max(len, this.functions[i].GetLength());
            }
        }
        return len;
    }

    /**
     * Updates the current value at a specific time
     * @param {number} time
     */
    UpdateValue(time)
    {
        this.GetValueAt(time, this.value);
    }

    /**
     * Gets a value at a specific time
     * @param {number} time
     * @param {vec3} value
     * @returns {vec3}
     */
    GetValueAt(time, value)
    {
        const vec3_0 = Tw2CurveSequencer.global.vec3_0;

        switch(this.operator)
        {
            case Tw2VectorSequencer.Operator.MULTIPLY:
                vec3.set(value, 1, 1, 1);
                for (let i = 0; i < this.functions.length; ++i)
                {
                    this.functions[i].GetValueAt(time, vec3_0);
                    vec3.multiply(value, value, vec3_0);
                }
                return value;

            default:
                vec3.set(value, 0, 0, 0);
                for (let i = 0; i < this.functions.length; ++i)
                {
                    this.functions[i].GetValueAt(time, vec3_0);
                    vec3.add(value, value, vec3_0);
                }
                return value;
        }
    }
}

/**
 * The sequencer's curve dimension
 * @type {number}
 */
Tw2VectorSequencer.inputDimension = 3;

/**
 * The sequencer's dimension
 * @type {number}
 */
Tw2VectorSequencer.outputDimension = 3;

/**
 * The sequencer's current value property
 * @type {string}
 */
Tw2VectorSequencer.valueProperty = 'value';

/**
 * The sequencer's type
 * @type {number}
 */
Tw2VectorSequencer.curveType = Tw2CurveSequencer.Type.SEQUENCER;

/**
 * The sequencer's curve properties
 * @type {string}
 */
Tw2VectorSequencer.childArray = 'functions';

/**
 * Operator types
 * @type {{MULTIPLY: number, ADD: number}}
 */
Tw2VectorSequencer.Operator = {
    MULTIPLY: 0,
    ADD: 1
};
