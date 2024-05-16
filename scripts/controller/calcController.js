class CalcController {
  constructor() {
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
  }

  initialize() {
    this.setDisplayDateTime();

    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);
  }

  // nó, mil treta configurar git
  
  initButtonEvents(){

    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

  }

  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }
  set displayCalc(value) {
    this._displayCalcEl.innerHTML = value;
  }

  get displayTime() {
    return this._timeEl.innerHTML;
  }

  set displayTime(value) {
    this._timeEl.innerHTML = value;
  }

  get displayDate() {
    return new Date();
  }
  set displayDate(date) {
    this._dateEl.innerHTML = date;
  }

  get currentDate() {
    return new Date();
  }
  set currentDate(value) {
    this._currentDate.innerHTML = value;
  }
}