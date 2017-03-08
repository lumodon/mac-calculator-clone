'use strict'

function Calculator() {
  this.domElements = {
    'Numbers': [
      document.querySelector('.calculator-row:nth-child(5) > .calculator-field:nth-child(1) > button'),
      document.querySelector('.calculator-row:nth-child(4) > .calculator-field:nth-child(1) > button'),
      document.querySelector('.calculator-row:nth-child(4) > .calculator-field:nth-child(2) > button'),
      document.querySelector('.calculator-row:nth-child(4) > .calculator-field:nth-child(3) > button'),
      document.querySelector('.calculator-row:nth-child(3) > .calculator-field:nth-child(1) > button'),
      document.querySelector('.calculator-row:nth-child(3) > .calculator-field:nth-child(2) > button'),
      document.querySelector('.calculator-row:nth-child(3) > .calculator-field:nth-child(3) > button'),
      document.querySelector('.calculator-row:nth-child(2) > .calculator-field:nth-child(1) > button'),
      document.querySelector('.calculator-row:nth-child(2) > .calculator-field:nth-child(2) > button'),
      document.querySelector('.calculator-row:nth-child(2) > .calculator-field:nth-child(3) > button'),
    ],
    'Operators': {
      'Clear': document.querySelector('.calculator-row:nth-child(1) > .calculator-field:nth-child(1) > button'),
      'Flip': document.querySelector('.calculator-row:nth-child(1) > .calculator-field:nth-child(2) > button'),
      'Percentage': document.querySelector('.calculator-row:nth-child(1) > .calculator-field:nth-child(3) > button'),
      'Divide': document.querySelector('.calculator-row:nth-child(1) > .calculator-field:nth-child(4) > button'),
      'Multiply': document.querySelector('.calculator-row:nth-child(2) > .calculator-field:nth-child(4) > button'),
      'Minus': document.querySelector('.calculator-row:nth-child(3) > .calculator-field:nth-child(4) > button'),
      'Plus': document.querySelector('.calculator-row:nth-child(4) > .calculator-field:nth-child(4) > button'),
      'Equals': document.querySelector('.calculator-row:nth-child(5) > .calculator-field:nth-child(3) > button'),
      'Decimal': document.querySelector('.calculator-row:nth-child(5) > .calculator-field:nth-child(2) > button')
    },
    'CurrentInput': document.querySelector('.calculator-current-input'),
    'History': document.querySelector('.calculator-history')
  }

  this.handleNumberInput = function(numberInput) {
    var nodeToAdd
    if( this.domElements.CurrentInput.children.length > 0 ) { // If we already have an ongoing input
      nodeToAdd = this.domElements.CurrentInput.firstChild
      nodeToAdd.textContent += numberInput
    } else {
      nodeToAdd = document.createElement('p')
      nodeToAdd.textContent = numberInput
    }
    nodeToAdd.style.margin = 0
    if( this.domElements.History.children.length > 4 ) {
      this.domElements.History.removeChild( this.domElements.History.firstChild )
    }
    if( this.domElements.CurrentInput.children.length > 0 ) {
      this.domElements.History.appendChild( this.domElements.CurrentInput.firstChild )
    }
    this.domElements.CurrentInput.appendChild( nodeToAdd )
  }

  this.handleOperatorInput = function(operatorInput) {
    console.log(operatorInput)
  }

  this.keyDownInterpreter = function(keyEvent) {
    // Prevent double click when pressing enter
    var activeElement = document.activeElement
    activeElement.blur()

    var getOperatorFromCode = {
      190: 'Decimal',   // .
      88:  'Multiply',  // x
      191: 'Divide',    // /
      189: 'Minus',     // -
      187: 'Equals',    // =
      13:  'Equals',    // enter
      27:  'Clear',     // esc
      67:  'Clear',     // c
      70:  'Flip'       // f
    }
    var keyCode = keyEvent.keyCode;

    if( keyCode >= 48 && keyCode <= 57 ) { // 48 is 0, 57 is 9. between is other numbers
      if( keyEvent.shiftKey && keyCode === 56 ) {
        this.handleOperatorInput.call(this, 'Multiply')
      } else if( keyEvent.shiftKey && keyCode === 53 ) {
        this.handleOperatorInput.call(this, 'Percentage')
      } else {
        this.handleNumberInput.call(this, keyCode-48)
      }
    } else {
      if( keyEvent.shiftKey && keyCode === 187 ) {
        this.handleOperatorInput.call(this, 'Plus')
      } else if( getOperatorFromCode.hasOwnProperty(keyCode) ) {
        this.handleOperatorInput.call(this, getOperatorFromCode[keyCode] + keyEvent)
      } else {
        // NOTE: Remove these lines before posting to prrr; for debug only
        // console.log('Keycode: ', keyCode)
      }
    }

    // Give focus back to element now that key has been handeled
    // timeout required so that enter doesn't continue to activate focused button
    window.setTimeout( function() {
      activeElement.focus()
    }, 1 ) // Even a single millisecond is enough to consistantly stop the problem. Amazing.
  }

  this.initialize = function() {
    // Handle keyboard events
    document.addEventListener('keydown', this.keyDownInterpreter.bind(this), false)

    // Populate onclick handlers for calculator buttons
    for(var i = 0; i < 10; i++) {
      this.domElements.Numbers[ i ].onclick = Calculator.scopeLock.call(this, i, this.handleNumberInput.bind(this) )
    }

    for(var key in this.domElements.Operators) {
      this.domElements.Operators[ key ].onclick = Calculator.scopeLock.call(this, key, this.handleOperatorInput.bind(this) )
    }
  }
}

// Static method - Helper function
Calculator.scopeLock = function(capturedArg, callback) {
  return function() {
    callback(capturedArg)
  }
}

var calc = new Calculator()
calc.initialize()