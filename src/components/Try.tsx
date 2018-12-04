import { Props, Component, ApplicationElement } from '../index';
import ComponentInstance from '../instances/types/Component/Instance';

type renderFunction = () => ApplicationElement;

type props = {
  catch: () => ApplicationElement;
  children: renderFunction;
};

export default class Try extends Component<props> {
  static displayName = 'ComponentName';

  private instance: ComponentInstance<props>;
  private errored = false;

  public invokeGuard<T>(callback: () => T): { hasError: true } | { hasError: false, result: T } {
    try {
      return {
        hasError: false,
        result: callback(),
      };
    } catch (error) {
      this.errored = true;
      this.update();

      return {
        hasError: true,
      };
    }
  }

  private setInvokeGuard() {
    if (this.errored) {
      this.instance.invokeGuard = (this.instance.parentInstance as ComponentInstance<any>).invokeGuard;
    } else {
      this.instance.invokeGuard = this.invokeGuard.bind(this);
    }
  }

  private update = () => {
    this.instance.invokeGuard = this.invokeGuard.bind(this);

    let result: ApplicationElement;

    if (this.errored) {
      result = this.instance.props.catch();
    } else {
      try {
        result = ((this.instance.props.children as any)[0] as renderFunction)();
      } catch (error) {
        this.errored = true;
        this.setInvokeGuard();

        result = this.instance.props.catch();
      }
    }

    this.instance.render(result);
  }

  componentWillUnmount() {
    this.instance.storeProps.unsubscribe(this.update);
  }

  render(Props: Props<props>, instance: ComponentInstance<props>) {
    this.instance = instance;

    this.instance.storeProps.subscribe(this.update);
    this.setInvokeGuard();

    try {
      return ((Props.getState().children as any)[0] as renderFunction)();
    } catch (error) {
      this.errored = true;
      this.setInvokeGuard();

      return Props.getState().catch();
    }
  }
}
