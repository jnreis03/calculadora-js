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
    //console.log(this._operation);
  }

  clearEntry() {
    this._operation.pop();
    //console.log(this._operation);
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

  pushOperation(value){
    this._operation.push(value);
    if(this._operation.length > 3){
      this.calc();
    }
  }

  calc(){
    let lastOp = this._operation.pop();
    let result = eval(this._operation.join(""));
    this._operation = [result, lastOp];
    this.setLastNumberToDisplay();
  }

  setLastNumberToDisplay(){
    let lastNumber;
    for(let i = this._operation.length-1; i >= 0; i--){
      if(!this.isOperator(this._operation[i])){
        lastNumber = this._operation[i];
        break;
      }

    }
    this.displayCalc = lastNumber;
  }

  addOperation(value) {

    //console.log("Last Digit isNaN? ", isNaN(this.getLastOperation()));
    if (isNaN(this.getLastOperation(value))) {
      // string
      if (this.isOperator(value)) {

        // trocar o operador
        this.setLastOperation(value);

      } else if (isNaN(value)) {

        //outra coisa
        //console.log(value);
        this.setError();

      } else {

        this.pushOperation(value);
        this.setLastNumberToDisplay();
        

      }

    } else {

      // cat two numbers
      if(isNaN(value))
        this.pushOperation(value);
      else{
        //console.log("caiu no ultimo else...");
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(parseInt(newValue));

        // atualizar display
        this.setLastNumberToDisplay();
  
      }
    }
    console.log(this._operation);
  }

  setError() {
    this.displayCalc = "Error";
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
        //this.displayCalc = this.calc();
        //console.log(this.calc());
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
        //console.log(btn.className.baseVal.replace("btn-", ""));

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
