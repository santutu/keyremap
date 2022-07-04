import {Container} from "inversify";
import {interfaces} from "inversify/lib/interfaces/interfaces";
import AutoClick from "../lib/AutoClick";


export const container = new Container({defaultScope: "Singleton", autoBindInjectable: true});
container.bind(AutoClick).to(AutoClick).inTransientScope()


export function overwrite<T>(bind: interfaces.ServiceIdentifier<T>, to: new (...args: any[]) => T) {
    if (container.isBound(bind)) {
        container.rebind(bind).to(to)
    } else {
        container.bind(bind).to(to)
    }
}