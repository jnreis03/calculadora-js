class CalcController {
  constructor() {
    this._audio = new Audio('click.mp3');
    this._audioOnOff = false;
    this._lastOperator = '';
    this._lastNumber = '';

    this._operation = [];
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonEvents();
    this.initKeyboard();
  }

  /**
   * literalmente a implementação do CTRL C CTRL V
   * gambiarra que cria um input e joga dentro dele o que está no display da calculadora, 
   * depois copia esse valor de dentro do input.
   */
  copyToClipboard(){

    if(navigator.clipboard){
      navigator.clipboard.writeText(this.displayCalc);
    }

  }

  /**
   * inverso do método copyToClipboard, coloca no display da calculadora informação do clipboard.
   */
  pasteFromClipboard(){
    document.addEventListener('paste', e=>{
      let text = e.clipboardData.getData('Text');
      this.displayCalc = parseFloat(text);

      console.log(text);

    });

  }
/**
 * inicia todos os métodos primarios para o funcionamento da calculadora
 */
  initialize() {

    this.setDisplayDateTime();

    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);

    this.setLastNumberToDisplay();
    this.pasteFromClipboard();

    document.querySelectorAll('.btn-ac').forEach(btn=>{
      btn.addEventListener('dblclick', e=>{
        this.toggleAudio();

      });
    });
  }

  /**
   * interruptor do som das teclas da calculadora
   * duplo clique no AC para ativar/desativar
   */
  toggleAudio(){
    this._audioOnOff = !this._audioOnOff;

  }
  playAudio(){
    if(this._audioOnOff){
      this._audio.currentTime = 0; // overlap de som de click
      this._audio.play();
    }
  }

/**
 * adiciona eventListener nas teclas do teclado para inserir os numeros
 * na calculadora quando usado o teclado fisico
 */
  initKeyboard(){

    document.addEventListener('keyup', e=>{

      this.playAudio(); // chamada do audio para eventos no teclado fisico

      switch (e.key) {
        case 'Escape':
          this.clearAll();
          break;
  
        case 'Backspace':
          this.clearEntry();
          break;
  
        case '%':
        case '/':
        case '*':
        case '-':
        case '+':
          this.addOperation(e.key);
          break;
  
        case 'Enter':
        case '=':
          this.calc();
          break;
  
        case '.':
        case ',':
          this.addDot('.');
          break;
  
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(e.key));
          break;
        
        case 'c':
          if(e.ctrlKey) this.copyToClipboard();
          break;

      }
      console.log(e.key);
    });
    
  }


  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn);
    });
  }

  // tecla AC
  clearAll() {
    this._operation = [];
    this._lastNumber = '';
    this._lastOperator = '';
    this.setLastNumberToDisplay();
    //console.log(this._operation);
  }

  // tecla CE
  clearEntry() {
    this._operation.pop();
    this.setLastNumberToDisplay();
    //console.log(this._operation);
  }

  // pega o ultimo item do array de calculo trabalhado, qualquer que seja
  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  // substitui o ultimo item do array de calculo trabalhado
  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }
  
  /**
   * 
   * @param {String} value 
   * @returns retorna o indice do operador, se não for operador, retorna -1,
   * basicamente serve de Bool para checar se um input é operador
   */
  isOperator(value) {
    return (["+", "-", "*", "%", "/"].indexOf(value) > -1);
  }

  /**
   * 
   * @param {any} value 
   * adiciona novos itens no array de calculo trabalhado, quando o array tem mais de 3
   * itens, resolve os 3 primeiros pois subentende que já é possivel realizar um calculo
   * com o inicio do array
   */
  pushOperation(value){
    this._operation.push(value);
    if(this._operation.length > 3){
      this.calc();
    }
  }

  /**
   * 
   * @returns resultado da operação pelo metodo eval
   */
  getResult(){

    try{

      return eval(this._operation.join(""));

    }catch(e){
      setTimeout(()=>{
        this.setError();
      }, 1);

    };

  }

  /**
   * logica da calculadora em si
   */
  calc(){

    let lastOp = '';
    this._lastOperator = this.getLastItem(); // guarda o ultimo operador da ultima operacao feita

    if(this._operation.length < 3){
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if(this._operation.length > 3){ // o pop só pode ocorrer com 4 ou mais itens para
                                    // não ocorrer de faltar termo pro eval: 30 + ''
      lastOp = this._operation.pop();
      this._lastNumber = this.getResult(); // guarda o resultado da operação, pro caso de multiplos cliques no igual (iterando)


    } else if(this._operation.length === 3){

      this._lastNumber = this.getLastItem(false); // guarda o ultimo numero, no caso a + b, guarda o b para o caso de multiplos
                                                  // cliques no igual (iterando)
    }
    //console.log('_lastOperator', this._lastOperator);
    //console.log('_lastNumber', this._lastNumber);

    let result = this.getResult();

    if(lastOp === '%'){

      result /= 100; // equivalente a escrever result = result / 100;
      this._operation = [result];

    } else {

      this._operation = [result];
      if(lastOp){ // confere se o ultimo termo da expressao é significativo, se for, volta pra operation
        this._operation.push(lastOp);
      }

    }
    console.log(this._operation);
    this.setLastNumberToDisplay();

  }
/**
 * 
 * @param {bool} isOperator 
 * @returns operand by default, or a number if false is passed as parameter
 */
  getLastItem(isOperator = true){

    let lastItem;
    for(let i = this._operation.length - 1; i >= 0; i--){

      if(this.isOperator(this._operation[i]) === isOperator){
        lastItem = this._operation[i];
        break;
      }
    }

    if(!lastItem){
      lastItem = (isOperator) ? this._lastOperator : this._lastNumber; 
    }

    return lastItem;
  }

  setLastNumberToDisplay(){

    let lastNumber = this.getLastItem(false);

    if(!lastNumber) lastNumber = 0;

    this.displayCalc = lastNumber;
  }

  addOperation(value) {

    //console.log("Last Digit isNaN? ", isNaN(this.getLastOperation()));
    if (isNaN(this.getLastOperation(value))) {
      // string
      if (this.isOperator(value)) {

        // trocar o operador
        this.setLastOperation(value);

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
        this.setLastOperation(newValue); 

        // atualizar display
        this.setLastNumberToDisplay();
  
      }
    }
    console.log(this._operation);
  }

  setError() {
    this.displayCalc = "Error";
  }

  addDot() {
    let lastOperation = this.getLastOperation();

    if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

    if(this.isOperator(lastOperation) || !lastOperation){ // quando o primeiro clique é no botao ponto
      this.pushOperation('0.');
    } else {
      this.setLastOperation(lastOperation.toString() + '.');
    }

    console.log("lastOperatorion", lastOperation);
    this.setLastNumberToDisplay();
  }


  execBtn(value) {
    this.playAudio();
    switch (value) {
      case 'ac':
        this.clearAll();
        break;

      case 'ce':
        this.clearEntry();
        break;

      case 'porcento':
        this.addOperation('%');
        break;

      case 'divisao':
        this.addOperation('/');
        break;

      case 'multiplicacao':
        this.addOperation('*');
        break;

      case 'subtracao':
        this.addOperation('-');
        break;

      case 'soma':
        this.addOperation('+');
        break;

      case 'igual':
        this.calc();
        break;

      case 'ponto':
        this.addDot('.');
        break;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
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
      this.addEventListenerAll(btn, "click drag", e => {
        let textBtn = btn.className.baseVal.replace("btn-", "");
        //console.log(btn.className.baseVal.replace("btn-", ""));

        this.execBtn(textBtn);
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

    if(value.toString().length > 10){ // mais de 10 caracteres display de error
      this.setError();
      return false;
    }

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
