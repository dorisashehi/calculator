class Node {
  //class to create a node
  constructor(value = null, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class Stack {
  //stach to push and pop nodes.
  constructor() {
    this.stack = [];
  }

  push(node) {
    //push node to stack
    this.stack.push(node);
  }

  pop() {
    //pop node from stack
    if (this.stack.length === 0) {
      throw new Error("Stack is empty");
    }
    return this.stack.pop();
  }

  peek() {
    //peek the top node
    return this.stack[this.stack.length - 1];
  }

  isEmpty() {
    //check if stack is empty
    return this.stack.length === 0;
  }
}

class ExpressionTree {
  evaluate(node) {
    if (!node) return 0; //return 0 if node is null

    if (!node.left && !node.right) {
      return parseInt(node.value); //if its a leaf node return the value
    }

    //recursively evaluate left and right subtrees
    let leftVal = this.evaluate(node.left);
    let rightVal = this.evaluate(node.right);

    switch (
      node.value // apply the operator to the value
    ) {
      case "+":
        return leftVal + rightVal;
      case "-":
        return leftVal - rightVal;
      case "*":
        return leftVal * rightVal;
      case "/":
        return leftVal / rightVal;
    }
  }
}

// Correct infix-to-postfix conversion
function infixToPostfix(infix) {
  let output = [];
  let operators = new Stack();
  let precedence = { "+": 1, "-": 1, "*": 2, "/": 2 }; //priority of the operations
  let associativity = { "+": "L", "-": "L", "*": "L", "/": "L" }; //processing order of the operations

  let tokens = infix.match(/\d+|\+|\-|\*|\/|\(|\)/g); // Extract numbers, operators, and parentheses
  console.log(tokens);

  for (let token of tokens) {
    if (!isNaN(token)) {
      output.push(token); // If it's a number, push to output
    } else if (token === "(") {
      operators.push(token); //it its "(", push to operators
    } else if (token === ")") {
      // Pop until left parenthesis
      while (!operators.isEmpty() && operators.peek() !== "(") {
        output.push(operators.pop()); // Pop operators to output
      }
      operators.pop(); // Remove the '('
    } else {
      // Operator handling
      while (
        !operators.isEmpty() &&
        precedence[operators.peek()] >= precedence[token] && // check priority
        associativity[token] === "L"
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  }

  while (!operators.isEmpty()) {
    output.push(operators.pop()); // Pop remaining operators
  }

  return output.join(" "); // Join the output with space
}

const numbersArr = Array.from(document.getElementsByClassName("number"));
const operatorsArr = Array.from(document.getElementsByClassName("operator"));
const parenthesisArr = Array.from(
  document.getElementsByClassName("parenthesis")
);
const clear = document.getElementsByClassName("clear")[0];
const equal = Array.from(document.getElementsByClassName("equals"))[0];

const numberStrs = "0123456789".split("");

const data = {
  displayString: "0",
  appendStringNum: (newChar) => {
    if (newChar === ".") {
      //decimal + 0?
    }

    if (numberStrs.includes(newChar)) {
      if (data.displayString === "0") {
        data.displayString = "";
      }
      data.displayString += newChar;
    }
    data.updateDisplay();
  },

  appendStringOperator: (newChar) => {
    if (
      numberStrs.includes(data.displayString.slice(-1)) ||
      data.displayString.slice(-1) === ")"
    ) {
      data.displayString += newChar;
    }
    data.updateDisplay();
  },

  appendStringParenthesis: (newChar) => {
    if (newChar === ")") {
      if (
        data.displayString.split("(").length <=
        data.displayString.split(")").length
      ) {
        //if there are not enough open parenthesis to add a closing parenthesis terminate early
        return;
      }
      if (
        operatorsArr
          .map((operator) => operator.innerText)
          .includes(data.displayString[data.displayString.length - 1])
      ) {
        //early termination for adding parenthesis after operator
        return;
      }
    }
    if (data.displayString === "0") {
      data.displayString = "";
      data.displayString += newChar;
      return;
    }

    data.displayString += newChar;

    data.updateDisplay();
  },
  updateDisplay: () => {
    const display = document.getElementById("display");
    display.innerText = data.displayString;
  },
  clearDisplay: () => {
    data.displayString = "0";
    data.updateDisplay();
  },
  stub: () => {
    let s = data.displayString; // the expression written in calculator
    let postfix = infixToPostfix(s); // Convert to postfix ex: (3 + 4) * 2 -> 3 4 + 2 *
    console.log("Postfix:", postfix);

    let stack = new Stack();
    let tree = new ExpressionTree();

    let tokens = postfix.split(" ");

    for (let token of tokens) {
      if (["+", "-", "*", "/"].includes(token)) {
        let z = new Node(token);
        let x = stack.pop();
        let y = stack.pop();
        z.left = y;
        z.right = x;
        stack.push(z);
      } else {
        stack.push(new Node(token));
      }
    }

    let root = stack.pop();
    let result = tree.evaluate(root);
    const display = document.getElementById("display");
    display.innerText = data.displayString + " = " + result;
  },
};

const display = document.getElementById("display");
display.innerText = data.displayString;

numbersArr.map((elem, i) => {
  elem.addEventListener("click", (evt) => {
    data.appendStringNum(elem.innerText);
  });
});

operatorsArr.map((elem, i) => {
  elem.addEventListener("click", (evt) => {
    data.appendStringOperator(elem.innerText);
  });
});

parenthesisArr.map((elem, i) => {
  elem.addEventListener("click", (evt) => {
    data.appendStringParenthesis(elem.innerText);
  });
});

clear.addEventListener("click", (evt) => {
  data.clearDisplay();
});

equal.addEventListener("click", () => {
  data.stub();
});
