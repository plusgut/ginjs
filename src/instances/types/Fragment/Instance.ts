import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import { props } from '../../../interfaces/component';


export default class FragmentInstance extends ChildrenInstance {
  public nodeType = types.Fragment;
  public type = types.Fragment;
  public props: props;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);
    this.props = abstractElement.props;
    this.addChildren(abstractElement.props.children);
  }

  /**
   * calculates the previous siblinglength, array is not its own parent, children are dependent of previousAbstractSiblingCount
   */
  public getPreviousSiblingsForChildren() {
    return this.previousAbstractSiblingCount();
  }
}
