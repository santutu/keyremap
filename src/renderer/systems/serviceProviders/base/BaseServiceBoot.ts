import {injectable} from "inversify";

@injectable()
export default abstract class BaseServiceBoot {

    abstract boot();

}