declare module "callbag-mock" {
  import { Source } from "callbag";

  type Mock<T> = {
    emit: (t: 0 | 1 | 2, d?: T) => void;
  };
  export default function mock<T = any>(
    isSource?: boolean,
    reporter?: () => void
  ): Source<T> & Mock<T>;
}
