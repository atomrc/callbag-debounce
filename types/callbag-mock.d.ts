declare module "callbag-mock" {
  import { Sink, Source } from "callbag";
  type Mock<T> = {
    emit: (t: 0 | 1 | 2, d?: T) => void;
    getMessages: () => [t: 0 | 1 | 2, d: T][];
    getReceivedData: () => T[];
    checkConnection: () => boolean;
  };

  export default function mock<T = unknown>(
    isSource: true
  ): Source<T> & Mock<T>;
  export default function mock<T = unknown>(
    isSource?: false
  ): Sink<T> & Mock<T>;
}
