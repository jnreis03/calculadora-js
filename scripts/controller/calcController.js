class CalcController {
  constructor() {
    this._operation = [];
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonEvents();
  }

  initialize() {
    this.setDisplayDateTime();

    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn);
    });
  }

  clearAll() {
    this._operation = [];
  }

  clearEntry() {
    this._operation.pop();
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }
  
  isOperator(value) {
    return (["+", "-", "*", "%", "/"].indexOf(value) > -1);
  }

  addOperation(value) {
    console.log("Last Digit isNaN? ", isNaN(this.getLastOperation()));

    if (isNaN(this.getLastOperation(value))) { // 789
      // string
      if (this.isOperator(value) && this._operation.length > 0) {

        // trocar o operador
        this.setLastOperation(value);

      } else if (isNaN(value)) {

        //outra coisa
        console.log(value);
        this.setError();

      } else {

        this._operation.push(value);
      }

    } else {

      // cat two numbers
      if(isNaN(value))
        this._operation.push(value);
      else{
        console.log("caiu no ultimo else...");
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(parseInt(newValue));
  
      }
    }

    console.log(this._operation);
  }

  setError() {
    this.displayCalc = "Error";
  }

  solveEquation(equation){
      return eval(equation.toString().replaceAll(',',''));
  }

  execBtn(value) {
    switch (value) {
      case "ac":
        this.clearAll();
        break;

      case "ce":
        this.clearEntry();
        break;

      case "porcento":
        this.addOperation("%");
        break;

      case "divisao":
        this.addOperation("/");
        break;

      case "multiplicacao":
        this.addOperation("*");
        break;

      case "subtracao":
        this.addOperation("-");
        break;

      case "soma":
        this.addOperation("+");
        break;

      case "igual":
        this.displayCalc = this.solveEquation(this._operation);
        console.log(this.solveEquation(this._operation));
        break;

      case "ponto":
        this.addOperation(".");
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value));
        break;
      default:
        this.setError();
        break;
    }
  }

  initButtonEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn) => {
      this.addEventListenerAll(btn, "click drag", (e) => {
        let text = btn.className.baseVal.replace("btn-", "");
        console.log(btn.className.baseVal.replace("btn-", ""));

        this.execBtn(text);
      });

      this.addEventListenerAll(btn, "mouseover mouseup mousedown", (e) => {
        btn.style.cursor = "pointer";
      });
    });
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
