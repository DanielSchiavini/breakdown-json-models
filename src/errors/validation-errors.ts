import {ResponseError} from '..';

/**
 * Class that represents model validation errors.
 */
export class ValidationError extends ResponseError {}

export const invalidEnumValue = (key: string, givenValue: any) =>
    new ValidationError(400, 'invalidEnumValue', 'The given enum value is not valid.', {key, givenValue});

export const fieldRequired = (key: string) =>
    new ValidationError(400, 'fieldRequired', 'The field is required.', {key});

export const invalidFormat = (key: string, givenValue: any, expectedFormat: string) =>
    new ValidationError(400, 'invalidFormat', 'The given value has an invalid format.',
        {key, givenValue, expectedFormat});

export const invalidType = (key: string, givenValue: any) =>
    new ValidationError(400, 'invalidType', 'The given value has an invalid type.', {key, givenType: typeof givenValue});
