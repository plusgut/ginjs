import plusnew, { Consumer } from 'index';
import Instance from '../instances/types/Component/Instance';
import factory, { ComponentContainer } from './factory';

type props = {
  elementDidMount?: (element: Element) => void;
  elementWillUnmount?: (element: Element) => Promise<any> | void;
  children: any,
};

const Animate: ComponentContainer<props> = factory(
  'Animate',
  (Props: Consumer<props>, instance) => {
    return <Props render={(props) => {
      instance.elementDidMount = (element: Element) => {
        (instance.parentInstance as Instance).elementDidMount(element);
        if (props.elementDidMount) {
          props.elementDidMount(element);
        }
      };

      instance.elementWillUnmount = (element: Element): Promise<any> | void => {
        let parentWait: void | Promise<any> = undefined;
        parentWait = (instance.parentInstance as Instance).elementWillUnmount(element);

        if (parentWait) {
          return new Promise((resolve) => {
            (parentWait as Promise<any>).then(() => {
              if (instance.props.elementWillUnmount) {
                instance.props.elementWillUnmount(element).then(() => resolve());
              } else {
                resolve();
              }
            });
          });
        }

        if (instance.props.elementWillUnmount) {
          return instance.props.elementWillUnmount(element);
        }
      };

      return props.children;
    }} />;
  },
);

export default Animate;

export { Instance, props };
