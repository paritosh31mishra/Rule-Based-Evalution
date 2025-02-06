const express = require('express');
const router = express.Router();
module.exports = router;

let Rule = require('../schema/ruleschema');


router.get('/', async (req, res) => {
  let Rulelist = await Rule.find();
  // console.log(Rulelist);
  res.status(201).json(Rulelist);
});


class ASTNode {
  constructor(type, value = null) {
    this.type = type; // 'condition', 'AND', 'OR'
    this.value = value; // The actual condition string for 'condition' type, null for 'AND'/'OR'
    this.left = null; // Left child (for binary operators)
    this.right = null; // Right child (for binary operators)
  }

  // Method to convert the ASTNode into a plain object
  toJSON() {
    return {
      type: this.type,
      value: this.value,
      left: this.left ? this.left.toJSON() : null,
      right: this.right ? this.right.toJSON() : null
    };
  }
}


function parseRuleToAST(rule) {
  const tokens = tokenize(rule);
  let index = 0;

  function tokenize(rule) {
    // Split rule by spaces, keeping operators and parentheses as separate tokens
    return rule.match(/AND|OR|\(|\)|[^\s()]+/g);
  }

  function parseExpression() {
    let node = parseTerm();
    while (index < tokens.length && (tokens[index] === 'AND' || tokens[index] === 'OR')) {
      const operator = tokens[index++];
      const rightNode = parseTerm();
      const newNode = new ASTNode(operator);
      newNode.left = node;
      newNode.right = rightNode;
      node = newNode;
    }
    return node;
  }

  function parseTerm() {
    if (tokens[index] === '(') {
      index++; // Skip '('
      const node = parseExpression();
      index++; // Skip ')'
      return node;
    } else {
      return parseFactor();
    }
  }

  function parseFactor() {
    let condition = '';

    while (index < tokens.length && tokens[index] !== 'AND' && tokens[index] !== 'OR' && tokens[index] !== ')') {
      condition += tokens[index++] + ' ';
    }

    // Clean up the condition string by trimming spaces
    condition = condition.trim();

    // Replace = by == in the condition
    condition = condition.replace(/=/g, '==');

    return new ASTNode('condition', condition);
  }

  return parseExpression();
}

function combineRules(rules) {
  // Parse each rule into its corresponding AST
  const asts = rules.map((rule) => parseRuleToAST(rule));

 

  function findCommonSubtrees(ast1, ast2) {
    if (!ast1 || !ast2) return null;
    
    // If both are conditions and they match
    if (ast1.type === 'condition' && ast2.type === 'condition' && ast1.value === ast2.value) {
      return ast1; // Return the common condition
    }
  
    // If both have the same operator type (AND/OR)
    if (ast1.type === ast2.type && (ast1.type === 'AND' || ast1.type === 'OR')) {
      const leftCommon = findCommonSubtrees(ast1.left, ast2.left);
      const rightCommon = findCommonSubtrees(ast1.right, ast2.right);
  
      // If either left or right subtree is common, create a new node
      if (leftCommon || rightCommon) {
        const commonNode = new ASTNode(ast1.type);
        commonNode.left = leftCommon || ast1.left;
        commonNode.right = rightCommon || ast1.right;
        return commonNode;
      }
    }
  
    return null;
  }
  

  // Combine two ASTs
  function combineTwoASTs(ast1, ast2) {
    const commonSubtree = findCommonSubtrees(ast1, ast2);
  console.log(commonSubtree);
    if (commonSubtree) {
      return commonSubtree; // Return the common subtree if found
    }

    // Otherwise, combine using the most frequent operator
    const combinedAST = new ASTNode('AND');
    combinedAST.left = ast1;
    combinedAST.right = ast2;
    return combinedAST;
  }

  // Combine all ASTs into one
  let combinedAST = asts[0];
  for (let i = 1; i < asts.length; i++) {
    combinedAST = combineTwoASTs(combinedAST, asts[i]);
  }

  return combinedAST;
}

// Example usage:

router.post('/', async (req, res) => {
  try {
    const rules_set = req.body.rule; // An array of rule strings
    console.log(rules_set.length);
    const ast = combineRules(rules_set); // Create optimized AST from rule strings
    //console.log(rootNode);

    let newRule = new Rule({
      rule: rules_set,
      ast: ast // Store the optimized AST
    });

    let info = await newRule.save();
    res.status(201).json({
      message: 'Rule Saved Successfully',
      error: 'NO',
      ast: ast.toJSON() // Convert AST to JSON before sending
    });
  } catch (error) {
    console.error('Error saving rule:', error);
    res.status(500).json({ message: 'Error saving rule', error: 'YES' });
  }
});



