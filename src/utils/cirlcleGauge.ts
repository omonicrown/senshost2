import { liquidFillGaugeDefaultSettings, loadLiquidFillGauge} from "./liquidFillGauge";

export class Gauge {
  private gauge1: any;
  private config1: any = {
    circleColor: "#FF7777",
    textColor: "#FF4444",
    waveTextColor: "#FFAAAA",
    waveColor: "#FFDDDD",
    circleThickness: 0.2,
    textVertPosition: 0.2,
    waveAnimateTime: 1000
  };

  constructor(element: any) {
    this.config1 = liquidFillGaugeDefaultSettings();
    this.config1 = {
      ...this.config1,
      circleColor: "#FF7777",
      textColor: "#FF4444",
      waveTextColor: "#FFAAAA",
      waveColor: "#FFDDDD",
      circleThickness: 0.2,
      textVertPosition: 0.2,
      waveAnimateTime: 1000
    };

    this.gauge1 = loadLiquidFillGauge(element, 55, null);
  }

  NewValue() {
    if (Math.random() > 0.5) {
      return Math.round(Math.random() * 100);
    } else {
      return (Math.random() * 100).toFixed(1);
    }
  }
}
