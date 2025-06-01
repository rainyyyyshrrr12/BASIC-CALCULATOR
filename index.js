class Calculator {
            constructor(previousOperandElement, currentOperandElement, memoryIndicatorElement) {
                this.previousOperandElement = previousOperandElement;
                this.currentOperandElement = currentOperandElement;
                this.memoryIndicatorElement = memoryIndicatorElement;
                this.memory = 0;
                this.clear();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.shouldResetScreen = false;
            }

            delete() {
                if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
                if (this.currentOperand.length === 1) {
                    this.currentOperand = '0';
                } else {
                    this.currentOperand = this.currentOperand.slice(0, -1);
                }
            }

            appendNumber(number) {
                if (this.shouldResetScreen || this.currentOperand === 'Error') {
                    this.currentOperand = '0';
                    this.shouldResetScreen = false;
                }
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand += number;
                }
            }

            chooseOperation(operation) {
                if (this.currentOperand === '0' && this.previousOperand === '') return;
                
                if (this.previousOperand !== '') {
                    this.compute();
                }
                
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.shouldResetScreen = true;
            }

            // Memory functions
            memoryAdd() {
                this.memory += parseFloat(this.currentOperand) || 0;
                this.updateMemoryIndicator();
            }

            memorySubtract() {
                this.memory -= parseFloat(this.currentOperand) || 0;
                this.updateMemoryIndicator();
            }

            memoryRecall() {
                this.currentOperand = this.memory.toString();
                this.shouldResetScreen = true;
            }

            memoryClear() {
                this.memory = 0;
                this.updateMemoryIndicator();
            }

            updateMemoryIndicator() {
                if (this.memory !== 0) {
                    this.memoryIndicatorElement.textContent = 'M';
                } else {
                    this.memoryIndicatorElement.textContent = '';
                }
            }

            // Advanced functions
            performFunction(functionType) {
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(current) && functionType !== 'negate') {
                    this.currentOperand = 'Error';
                    this.shouldResetScreen = true;
                    return;
                }

                let result;
                switch (functionType) {
                    case 'sqrt':
                        if (current < 0) {
                            this.currentOperand = 'Error';
                            this.shouldResetScreen = true;
                            return;
                        }
                        result = Math.sqrt(current);
                        break;
                    case 'square':
                        result = current * current;
                        break;
                    case 'reciprocal':
                        if (current === 0) {
                            this.currentOperand = 'Error';
                            this.shouldResetScreen = true;
                            return;
                        }
                        result = 1 / current;
                        break;
                    case 'percent':
                        result = current / 100;
                        break;
                    case 'negate':
                        if (this.currentOperand === '0') return;
                        if (this.currentOperand.startsWith('-')) {
                            this.currentOperand = this.currentOperand.substring(1);
                        } else {
                            this.currentOperand = '-' + this.currentOperand;
                        }
                        return;
                    default:
                        return;
                }
                
                // Round to avoid floating point issues
                result = Math.round(result * 1000000000) / 1000000000;
                this.currentOperand = result.toString();
                this.shouldResetScreen = true;
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                    case '*':
                        computation = prev * current;
                        break;
                    case '÷':
                    case '/':
                        if (current === 0) {
                            this.currentOperand = 'Error';
                            this.operation = undefined;
                            this.previousOperand = '';
                            this.shouldResetScreen = true;
                            return;
                        }
                        computation = prev / current;
                        break;
                    case '%':
                        computation = (prev * current) / 100;
                        break;
                    default:
                        return;
                }
                
                // Round to avoid floating point issues
                computation = Math.round(computation * 1000000000) / 1000000000;
                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
            }

            getDisplayNumber(number) {
                if (number === 'Error') return 'Error';
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                let integerDisplay;
                
                if (isNaN(integerDigits)) {
                    integerDisplay = '0';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            updateDisplay() {
                this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
                if (this.operation != null) {
                    this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandElement.innerText = '';
                }
            }
        }

        // DOM Elements
        const numberButtons = document.querySelectorAll('[data-number]');
        const operationButtons = document.querySelectorAll('[data-operation]');
        const equalsButton = document.querySelector('[data-equals]');
        const deleteButton = document.querySelector('[data-delete]');
        const allClearButton = document.querySelector('[data-all-clear]');
        const memoryButtons = document.querySelectorAll('[data-memory]');
        const functionButtons = document.querySelectorAll('[data-function]');
        const previousOperandElement = document.querySelector('.previous-operand');
        const currentOperandElement = document.querySelector('.current-operand');
        const memoryIndicatorElement = document.getElementById('memoryIndicator');

        // Initialize Calculator
        const calculator = new Calculator(previousOperandElement, currentOperandElement, memoryIndicatorElement);

        // Event Listeners
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.appendNumber(button.innerText);
                calculator.updateDisplay();
            });
        });

        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.chooseOperation(button.innerText);
                calculator.updateDisplay();
            });
        });

        equalsButton.addEventListener('click', () => {
            calculator.compute();
            calculator.updateDisplay();
        });

        allClearButton.addEventListener('click', () => {
            calculator.clear();
            calculator.updateDisplay();
        });

        deleteButton.addEventListener('click', () => {
            calculator.delete();
            calculator.updateDisplay();
        });

        // Memory button event listeners
        memoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const memoryFunction = button.getAttribute('data-memory');
                switch(memoryFunction) {
                    case 'MC':
                        calculator.memoryClear();
                        break;
                    case 'MR':
                        calculator.memoryRecall();
                        break;
                    case 'M+':
                        calculator.memoryAdd();
                        break;
                    case 'M-':
                        calculator.memorySubtract();
                        break;
                }
                calculator.updateDisplay();
            });
        });

        // Function button event listeners
        functionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const functionType = button.getAttribute('data-function');
                calculator.performFunction(functionType);
                calculator.updateDisplay();
            });
        });

        // Keyboard support
        document.addEventListener('keydown', e => {
            if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
                calculator.appendNumber(e.key);
                calculator.updateDisplay();
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
                let operation = e.key;
                if (operation === '/') operation = '÷';
                if (operation === '*') operation = '×';
                calculator.chooseOperation(operation);
                calculator.updateDisplay();
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                calculator.compute();
                calculator.updateDisplay();
            } else if (e.key === 'Backspace') {
                calculator.delete();
                calculator.updateDisplay();
            } else if (e.key === 'Escape') {
                calculator.clear();
                calculator.updateDisplay();
            } else if (e.key.toLowerCase() === 's') {
                calculator.performFunction('sqrt');
                calculator.updateDisplay();
            } else if (e.key.toLowerCase() === 'q') {
                calculator.performFunction('square');
                calculator.updateDisplay();
            } else if (e.key.toLowerCase() === 'r') {
                calculator.performFunction('reciprocal');
                calculator.updateDisplay();
            } else if (e.key.toLowerCase() === 'p') {
                calculator.performFunction('percent');
                calculator.updateDisplay();
            } else if (e.key.toLowerCase() === 'n') {
                calculator.performFunction('negate');
                calculator.updateDisplay();
            }
        });