import { DocumentActionType } from 'app/constants';
import { Observable } from 'rxjs';
import { Document } from 'types/api-schema';

export interface DocumentAction {
  type: DocumentActionType; // Unique identifier of an action
  label: string; // Text for the tooltip
  icon?: string; // Icon name from Material Icons
  colorClass?: 'error' | 'primary' | 'warn'; // Styling type
}

/**
 * This interface defines the structure for a command that can be executed on a document.
 * It encapsulates both the visual representation of an action and the underlying logic to perform it.
 */
export interface DocumentCommand {
  /**
   * Represents the visual action associated with this command, such as a button or a menu item.
   * It contains information about the action's type, label, and icon.
   */
  relatedAction: DocumentAction;

  /**
   * A function that determines whether this command is currently available or applicable
   * for a given document in the list.
   *
   * If it returns `true` - means that it's `relatedAction` should be shown as an action available for the specific document.
   *
   * @param document An optional document object. If provided, the availability can be determined based on the document's state.
   *
   */
  isAvailable(document?: Document): boolean;

  /**
   * A function that executes the action-related logic associated with this command.
   *
   * @param document An optional document object on which the command should be executed.
   * @returns An Observable that emits a boolean value which indicate if the data **needs to be reloaded after executing**.
   */
  execute(document?: Document): Observable<boolean>;
}
