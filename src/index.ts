import PIIMaskProcessor from "./PIIMaskProcessor";
import { generateHandler } from "@data-channels/dcSDK";
import MergeProcessor from "./MergeProcessor";
import SplitProcessor from "./SplitProcessor/SplitProcessor";

export const handler = generateHandler({
  piiMask: PIIMaskProcessor,
  split: SplitProcessor,
  merge: MergeProcessor,
});