import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom TitleCase Pipe that transforms camelCase or PascalCase strings to Title Case.
 * ```html
 * {{'firstName' | titleCase}} -> 'First Name'
 * {{'UserProfile' | titleCase}} -> 'User Profile'
 * ```
 */
@Pipe({
  name: 'titleCase',
})
export class MyTitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    // Add spaces before uppercase letters (except the first one) to separate words in camelCase or PascalCase.
    const stringWithSpaces = value.replace(/([A-Z])/g, ' $1').trim();

    const words = stringWithSpaces.split(' ');

    // Capitalize the first letter of each word and convert the rest of the letters to lowercase.
    const capitalizedWords = words.map((word, index) => {
      if (word.length === 0) {
        return '';
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return capitalizedWords.join(' ');
  }
}
