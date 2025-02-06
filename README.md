### Rule-Based Evaluation Project
 
 ## Motivation:
      The project aimed to create a flexible and dynamic rule engine to evaluate user data based on configurable rules. The primary motivation was to allow users to create and manage rules, combine them, and evaluate data in real-time using a structured and efficient system. This was designed to solve real-world problems like eligibility checks, decision-making workflows, and custom data validations.

## Project Overview:
      The Rule-Based Evaluation project is a web-based application that enables users to:
      
     # Create Rules: Define conditions using logical operators like AND and OR.
     # Combine Rules: Merge multiple rules into a composite rule for complex evaluations.
     # Evaluate Data: Use the rules to determine if user-provided data satisfies specific conditions.

## Technical Details:

  # Frontend:

        Developed using React.js for a dynamic and responsive user interface.
        Created components for tabs corresponding to the main functionalities: Create Rule, Combine Rules, and Evaluate Rules.
        Implemented validations for rule creation, ensuring syntax correctness (e.g., rules must include AND or OR and be at least 50 characters long).
        Added features like a real-time error display (e.g., highlighting invalid inputs with red borders).
        Used fetch API to send rules and evaluation data to the backend.

  # Backend:

        Built with Node.js for handling rule storage, processing, and evaluation requests.
        Developed APIs for:
        Storing created rules in a database.
        Parsing and combining rules into Abstract Syntax Trees (ASTs).
        Evaluating data against the AST structure.

## Rule Parsing and AST Generation:
        Used a custom parser to convert rule strings into condition objects.
        Standardized conditions with consistent comparison operators (==) and formatting.
        Built an AST for structured and efficient evaluation.
        
## Evaluation Logic:
      Implemented an evaluation function using JavaScript's eval to process the AST.
      Supported logical operators (AND, OR) and nested conditions.
      Example: A rule like (age > 18 AND income > 30000) OR (department == 'IT') was evaluated dynamically.

## Testing and Validation:
      Tested APIs using Postman.
      Verified rule evaluation with diverse datasets to ensure correctness and reliability.
      Conducted frontend testing to validate the user experience and ensure smooth rule creation and evaluation workflows.
      
## Personal Contribution:
      Designed the frontend architecture, ensuring a clean and user-friendly interface for rule management.
      Built the rule validation logic to enforce syntactical correctness during rule creation.
      Implemented the AST parsing and evaluation logic, ensuring accurate and efficient rule-based data processing.
      Developed and tested backend APIs, focusing on performance and scalability.
      Ensured seamless integration between the frontend and backend for a smooth user experience.
