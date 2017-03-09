'use strict'
var DEBUG = false
if(DEBUG){
  var dbg = document.createElement('p')
  dbg.textContent = 'default text'
  dbg.style.position = 'absolute'
  dbg.style.top = '0px'
  document.querySelector('body').appendChild(dbg)
}

function dbgt() {
  var argumentString = ''
  for(var i of arguments) {
    argumentString += i
  }
  dbg.textContent = '$ '+argumentString
  console.log(argumentString)
}

(function(){
  var originalErrFunction = console.error

  console.error = function() {
    var debugMessage = ['Error: ']
    for(var i of arguments) {
      debugMessage.push(i)
    }
    dbgt(debugMessage.join(''))
    originalErrFunction.apply(null, arguments)
  }
}())

function Calculator() {
  this.operands = []
  this.tailIndex = 0
  this.inputSize = 3.0
  this.clearOrAllClear = 'all'
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

  this.updateDisplayNode = function() {
    var nodeToAdd = this.domElements.CurrentInput.firstChild

    function lineHeightFromFontSize(fontSize, deltaSize) {
      return ( 2.0 - (deltaSize*1.8) ).toString() // f(x) = 2 - 1.8x
    }

    if( !nodeToAdd ) {
      nodeToAdd = document.createElement('p')
      nodeToAdd.style.margin = 0
      nodeToAdd.style.display = 'table-cell'
      this.domElements.CurrentInput.appendChild(nodeToAdd)
    }
    nodeToAdd.textContent = this.operands.join('')
    this.domElements.Operators.Clear.textContent = this.clearOrAllClear === 'all' ? 'AC' : 'C'

    // TODO: Setup dynamic resizing:
    // Resize line height. Not working at the moment. 
    // Upon resize, line height is too low, but technically word fits so while loop for reducing
    // the size, the widths are indeed accurate. (it's vertical overflow thats the problem)
    // while(this.domElements.CurrentInput.scrollWidth > this.domElements.CurrentInput.parentNode.clientWidth && this.inputSize >= 1.5) {
    //   this.inputSize -= 0.1
    //   this.domElements.CurrentInput.style.fontSize = this.inputSize.toString() + 'em'
    //   this.domElements.CurrentInput.style.lineHeight = lineHeightFromFontSize(this.inputSize, -0.1) + 'em'
    // }
    // while(this.domElements.CurrentInput.scrollWidth <= this.domElements.CurrentInput.parentNode.clientWidth && this.inputSize < 3) {
    //   this.inputSize += 0.1
    //   this.domElements.CurrentInput.style.fontSize = this.inputSize.toString() + 'em'
    //   this.domElements.CurrentInput.style.lineHeight = lineHeightFromFontSize(this.inputSize, 0.1) + 'em'
    // }
  }

  this.handleNumberInput = function(numberInput) {
    if( this.domElements.History.children.length > 4 ) {
      this.domElements.History.removeChild( this.domElements.History.firstChild )
    }

    if( this.operands.length-1 === this.tailIndex ) {
      this.operands[this.tailIndex] += numberInput.toString()
    } else {
      this.operands.push(numberInput.toString())
    }

    this.clearOrAllClear = 'clear'
    this.updateDisplayNode()
  }

  this.handleOperatorInput = function(operatorInput) {
    if( this.operands.length <= 0 && operatorInput !== 'Decimal') {
      console.error('Operator pressed without any numbers to perform operation on')
      return null
    }

    switch(operatorInput) {
      case 'Decimal':
        if( !this.operands[this.tailIndex] ) {
          this.operands[this.tailIndex] = '0.'
        } else if( !this.operands[this.tailIndex].split('').includes('.') ) {
          this.operands[this.tailIndex] += '.'
        }
        this.clearOrAllClear = 'clear'
        break
      case 'Plus':
        this.operands[this.tailIndex] += ' + '
        this.tailIndex++
        break
      case 'Minus':
        this.operands[this.tailIndex] += ' - '
        this.tailIndex++
        break
      case 'Multiply':
        this.operands[this.tailIndex] += ' x '
        this.tailIndex++
        break
      case 'Divide':
        this.operands[this.tailIndex] += ' ÷ '
        this.tailIndex++
        break
      case 'Clear':
        if(this.clearOrAllClear === 'clear') {
          this.operands[this.tailIndex] = ''
          this.clearOrAllClear = 'all'
        } else {
          this.tailIndex = 0
          this.operands = []
        }
        break
      case 'Flip':
        break
      case 'Equals':
        this.calculateEquals()
        break
      default:
        break
    }
    this.updateDisplayNode()
  }

  this.calculateEquals = function(leftOperandStr, rightOperandStr) {
    try {
      if(this.operands.length <= 0) {
        return 0
      }
      for( var i in this.operands ) {
        i = parseInt(i)
        if(!this.operands[i+1]) {
          return this.operands[i]
        }
        var accumulateResult = this.calculate(this.operands[i], this.operands[i+1])
        this.operands.shift()
        this.tailIndex--
        this.operands[i] = accumulateResult 
      }
    } catch(err) {
      dbgt(err)
      console.error(err)
      this.clearOrAllClear = 'all'
      handleOperatorInput('Clear')
    }
    this.updateDisplayNode()
  }
  this.calculate = function(leftOperandStr, rightOperandStr) {
    var operator = leftOperandStr.match( /[^\s\d]/ )[0]
    var leftOperand = parseInt( leftOperandStr.match( /\d*/ )[0] )
    var rightOperand = parseInt( rightOperandStr.match( /\d*/ )[0] )
    switch(operator) {
      case '+':
        return (leftOperand + rightOperand).toString()
        break
      case '-':
        return (leftOperand - rightOperand).toString()
        break
      case '÷':
        if(rightOperand === 0) {
          throw new Error('Cannot divide by zero')
        }
        return (leftOperand / rightOperand).toString()
        break
      case 'x':
        return (leftOperand * rightOperand).toString()
        break
      default:
        return null
        break
    }
  }

  this.keyDownInterpreter = function(keyEvent) {
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

    if( keyCode >= 48 && keyCode <= 57 ) {
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
        this.handleOperatorInput.call(this, getOperatorFromCode[keyCode])
      }
    }

    window.setTimeout( function() {
      activeElement.focus()
    }, 1 )
  }

  this.initialize = function() {
    document.addEventListener('keydown', this.keyDownInterpreter.bind(this), false)

    for(var i = 0; i < 10; i++) {
      this.domElements.Numbers[ i ].onclick = Calculator.scopeLock.call(this, i, this.handleNumberInput.bind(this) )
    }

    for(var key in this.domElements.Operators) {
      this.domElements.Operators[ key ].onclick = Calculator.scopeLock.call(this, key, this.handleOperatorInput.bind(this) )
    }
  }
}

Calculator.scopeLock = function(capturedArg, callback) {
  return function() {
    callback(capturedArg)
  }
}

var calc = new Calculator()
calc.initialize()
calc.updateDisplayNode()