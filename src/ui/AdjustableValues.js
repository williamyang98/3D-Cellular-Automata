export class Toggle {
  constructor(value) {
    this.type = 'toggle';
    this.value = value;
  }
}

export class Slider {
  constructor(min, max, value) {
    this.type = 'slider';
    this.min = min;
    this.max = max;
    this.value = value;
  }

  set value(val) {
    val = this.clamp(val);
    this._value = val;
  }

  get value() {
    return this._value;
  }

  clamp(val) {
    if (val < this.min) {
      val = this.min;
    }
    if (val > this.max) {
      val = this.max;
    }
    return val;
  }
}