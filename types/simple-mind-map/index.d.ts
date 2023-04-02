export default class MindMap {
  constructor(opt = {});
  render(): void;
  resize(): void;
}

export class Drag {
  constructor({ mindMap });
  reset(): void;
  bindEvent(): void;
  onMouseup(e): void;
  createCloneNode(): void;
  removeCloneNode(): void;
  onMove(x, y): void;
  checkOverlapNode(): void;
}
