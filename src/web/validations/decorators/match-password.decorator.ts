import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPasswords', async: false })
export class MatchPasswordsConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const password = (args.object as any)[relatedPropertyName];
    return confirmPassword === password;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password and confirmPassword do not match';
  }
}

export function MatchPasswords(property: string, validationOptions?: ValidationOptions) {
  return (object: NonNullable<unknown>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchPasswordsConstraint,
    });
  };
}
