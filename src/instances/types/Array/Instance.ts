import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import reconcile from './reconcile';

export default class ArrayInstance extends ChildrenInstance {
  public nodeType = types.Array;
  public type = types.Array;
  public props: (PlusnewAbstractElement)[];

  constructor(
    abstractElements: (PlusnewAbstractElement)[],
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElements, parentInstance, previousAbstractSiblingCount);
    this.props = abstractElements;
    this.addChildren(abstractElements);
  }

  /**
   * calculates the previous siblinglength, array is not its own parent, children are dependent of previousAbstractSiblingCount
   */
  public getPreviousSiblingsForChildren() {
    return this.previousAbstractSiblingCount();
  }

  public reconcile(newAbstractElements: PlusnewAbstractElement[]) {
    reconcile(newAbstractElements, this);
    return this;
  }
}
