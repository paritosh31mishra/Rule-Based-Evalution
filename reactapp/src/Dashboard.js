
import { useState, useEffect } from 'react';

// Define the AST evaluation functions
const evaluateAST = (ast, data) => {
  if (ast.type === 'condition') {
    console.log(ast.value);

    let r = evalCondition(ast.value, data);
    console.log(r);
    console.log(' ');
    return r;
  }

  const left = evaluateAST(ast.left, data);
  const right = evaluateAST(ast.right, data);

  if (ast.type === 'AND') {
    return left && right;
  } else if (ast.type === 'OR') {
    return left || right;
  }

  return false;
};

const evalCondition = (condition, data) => {
  // Use a regex to match the field, operator, and value
  const match = condition.match(/^(\w+)\s*(==|!=|<=|>=|<|>)\s*(.+)$/);

  console.log('Condition:', condition);

  if (!match) {
    throw new Error(`Invalid condition: ${condition}`);
  }

  const [, field, operator, value] = match;

  console.log('Field:', field, 'Operator:', operator, 'Value:', value);

  // Determine whether the value is numeric or a string and evaluate it accordingly
  let formattedValue = value.trim();

  if (isNaN(formattedValue)) {
    let originalString = formattedValue;
    formattedValue = `"${originalString.replace(/'/g, '')}"`;
  }

  // Convert the data field to a string if it's not a number, and compare it correctly
  const dataValue = isNaN(data[field])
    ? JSON.stringify(data[field])
    : data[field];

  // Log for debugging

  console.log(
    'Data Field Value:',
    dataValue,
    'Formatted Value:',
    formattedValue
  );

  return eval(`${dataValue} ${operator} ${formattedValue}`);
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [rules, setRules] = useState([]);
  const [rulegroup, group] = useState('');
  //  const [selectedRules, setSelectedRules] = useState([]);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(null);
   const [rule, setRule] = useState("");
  const [age, setAge] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [errors, setErrors] = useState({
    rule: '',
    age: '',
    department: '',
    salary: '',
    experience: '',
    selectedRule: '',
  });

  const [grouperrors, setgroupErrors] = useState('');
  //const [selectedRule, setSelectedRule] = useState("");

  useEffect(() => {
    if (activeTab === 'evaluate') {
      fetchRules();
    }
  }, [activeTab]);

  const fetchRules = () => {
    fetch('https://rule-based-evalution-backend.onrender.com/rules')
      .then((response) => response.json())
      .then((rulesArray) => {
        setRules(rulesArray);
      })
      .catch((error) => {
        console.error('Error fetching rules:', error);
      });
  };

  // combine rule section
  const validate_combine_Rules = () => {
    //alert("paritosh");
    let valid = true;
    let newErrors = '';

    if (rulegroup.trim() === '') {
      valid = false;
      newErrors = 'Rule cannot be empty.';
    } else if (rulegroup.length < 50) {
      valid = false;
      newErrors = 'Rule must be at least 50 characters long.';
    } else if (!/AND|OR/.test(rulegroup)) {
      valid = false;
      newErrors = "Rule must contain at least one 'AND' or 'OR' operator.";
    } else {
      newErrors = '';
    }

    setgroupErrors(newErrors);
    console.log(valid);
    if (valid) {
      if (rulegroup.trim() === '') {
        setgroupErrors({ rule: 'Please enter at least one rule.' });
        return;
      }
      
      // Split the rules by commas and trim spaces
      const rulesArray = rulegroup.split(',').map((r) => r.trim());
      
      submitRules(rulesArray);
    }
  };




  const validateRule = () => {
    let valid = true;
    let newErrors = { ...errors };

    if (rule.trim() === '') {
      valid = false;
      newErrors.rule = 'Rule cannot be empty.';
    } else if (rule.length < 50) {
      valid = false;
      newErrors.rule = 'Rule must be at least 50 characters long.';
    } else if (!/AND|OR/.test(rule)) {
      valid = false;
      newErrors.rule = "Rule must contain at least one 'AND' or 'OR' operator.";
    } else {
      newErrors.rule = '';
    }

    setErrors(newErrors);

    if (valid) {
      let temp = [];
      temp.push(rule);
      submitRules(temp); // Call submitRules function to send the new rulegroup
    }
  };

  const submitRules = (array) => {
    const url = 'https://rule-based-evalution-backend.onrender.com/rules';
    //console.log(selectedRules);
    const newRule = {
      rule: array
    };
    console.log(array.length);
    const postdata = {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(newRule),
    };

    fetch(url, postdata)
      .then((response) => response.json())
      .then((data) => {
      console.log(data.ast);
        alert('Root Node: ' + data.ast.type + '   Rule Added Successfully!');
      })
      .catch((error) => {
        console.error('Error submitting rule:', error);
      });
  };

  const handleRuleSelection = (index) => {
    setSelectedRuleIndex(index);
  };

  // evalution section

  const validateEvaluation = () => {
    let valid = true;
    let newErrors = { ...errors };

    if (age.trim() === '' || isNaN(age)) {
      valid = false;
      newErrors.age = 'Age must be a number and cannot be empty.';
    } else {
      newErrors.age = '';
    }

    if (department.trim() === '') {
      valid = false;
      newErrors.department = 'Department cannot be empty.';
    } else {
      newErrors.department = '';
    }

    if (salary.trim() === '' || isNaN(salary)) {
      valid = false;
      newErrors.salary = 'Salary must be a number and cannot be empty.';
    } else {
      newErrors.salary = '';
    }

    if (experience.trim() === '' || isNaN(experience)) {
      valid = false;
      newErrors.experience = 'Experience must be a number and cannot be empty.';
    } else {
      newErrors.experience = '';
    }

    if (selectedRuleIndex == null) {
      valid = false;
      newErrors.selectedRule = 'Please select a rule.';
    } else {
      newErrors.selectedRule = '';
    }

    setErrors(newErrors);

    if (valid) {
      getAST();
    }
  };

  const getAST = () => {
    // Ensure a rule is selected
    if (selectedRuleIndex === null) {
      alert('Please select a rule.');
      return;
    }

    // Retrieve the selected rule from the rules array using the index
    const selectedRule = rules[selectedRuleIndex];

    // Extract the AST directly from the selected rule
    const ast = selectedRule.ast;

    // Prepare the evaluation data
    const evaluationData = {
      age,
      department,
      salary,
      experience,
    };

    // Call the evaluateAST function with the AST and evaluation data
    const result = evaluateAST(ast, evaluationData);

    // Handle the evaluation result (e.g., display a message or update the UI)
    alert(`Evaluation Result: ${result ? 'True' : 'False'}`);
  };

  return (
    <section>
      <div className='container'>
        <div className='row mt-5'>
          <div className='col-lg-12 text-center fs-1 fw-bold text-dark'>
            Rules & Eligibility
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 p-5 text-center'>
            <div className='btn-group'>
              <button
                className={`btn btn-outline-dark fw-bold ${
                  activeTab === 'create' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('create')}
              >
                Create Rule
              </button>
              <button
                className={`btn btn-outline-dark fw-bold ${
                  activeTab === 'combine' ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveTab('combine');
                 // fetchRules();
                }}
              >
                Combine Rules
              </button>
              <button
                className={`btn btn-outline-dark fw-bold ${
                  activeTab === 'evaluate' ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveTab('evaluate');
                  fetchRules();
                }}
              >
                Evaluate Rules
              </button>
            </div>
          </div>
        </div>
        <div className='row mb-5'>
          <div className='container p-5 feedback-box'>
            <div className='row'>
              <h3 className='text-center'>
                {activeTab === 'create' && 'Create Rule'}
                {activeTab === 'combine' && 'Combine Rules'}
                {activeTab === 'evaluate' && 'Evaluate Rules'}
              </h3>
            </div>

            <div className='row'>
              <div className='col-lg-3'></div>
              <div className='col-lg-6'>
                {activeTab === 'create' && (
                  <form>
                    <textarea
                      className={`form-control mb-3 ${
                        errors.rule ? 'is-invalid' : ''
                      }`}
                      placeholder='Enter Rule'
                      value={rule}
                      onChange={(e) => setRule(e.target.value)}
                      rows={8}
                      style={{ borderColor: errors.rule ? 'red' : '' }}
                    ></textarea>
                    {errors.rule && (
                      <small className='text-danger fst-italic'>
                        <i>{errors.rule}</i>
                      </small>
                    )}
                    <div className='text-center'>
                      <button
                        type='button'
                        className='btn btn-primary mt-3'
                        onClick={validateRule}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'combine' && (
                  <form>
                    <h5>Write rules and separate them by commas</h5>
                    <textarea
                      className={`form-control mb-3 ${
                        errors.rule ? 'is-invalid' : ''
                      }`}
                      placeholder='Enter rules separated by commas'
                      value={rulegroup}
                      onChange={(e) => group(e.target.value)}
                      rows={8}
                      style={{ borderColor: errors.rule ? 'red' : '' }}
                    ></textarea>
                    {grouperrors && (
                      <div className='text-danger'>{grouperrors}</div>
                    )}
                    <div className='text-center'>
                      <button
                        type='button'
                        className='btn btn-primary mt-3'
                        onClick={validate_combine_Rules}
                      >
                        Combine
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'evaluate' && (
                  <form>
                    <div className='mb-3'>
                      <label className='form-label'>Age</label>
                      <input
                        type='number'
                        className={`form-control ${
                          errors.age ? 'is-invalid' : ''
                        }`}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        style={{ borderColor: errors.age ? 'red' : '' }}
                      />
                      {errors.age && (
                        <small className='text-danger fst-italic'>
                          <i>{errors.age}</i>
                        </small>
                      )}
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Department</label>
                      <input
                        type='text'
                        className={`form-control ${
                          errors.department ? 'is-invalid' : ''
                        }`}
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        style={{ borderColor: errors.department ? 'red' : '' }}
                      />
                      {errors.department && (
                        <small className='text-danger fst-italic'>
                          <i>{errors.department}</i>
                        </small>
                      )}
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Salary</label>
                      <input
                        type='number'
                        className={`form-control ${
                          errors.salary ? 'is-invalid' : ''
                        }`}
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        style={{ borderColor: errors.salary ? 'red' : '' }}
                      />
                      {errors.salary && (
                        <small className='text-danger fst-italic'>
                          <i>{errors.salary}</i>
                        </small>
                      )}
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Experience</label>
                      <input
                        type='number'
                        className={`form-control ${
                          errors.experience ? 'is-invalid' : ''
                        }`}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        style={{ borderColor: errors.experience ? 'red' : '' }}
                      />
                      {errors.experience && (
                        <small className='text-danger fst-italic'>
                          <i>{errors.experience}</i>
                        </small>
                      )}
                    </div>

                    {rules.length > 0 && (
                      <div>
                        <label className='form-label'>
                          Select the rule by which you want to evaluate:
                        </label>
                        {rules.map((rule, index) => (
                          <div key={index} className='form-check'>
                            <input
                              className='form-check-input'
                              type='radio'
                              value={index}
                              checked={selectedRuleIndex === index}
                              onChange={() => handleRuleSelection(index)}
                            />
                            <label className='form-check-label'>
                              {rule.rule}
                            </label>
                          </div>
                        ))}

                        {errors.selectedRule && (
                          <small className='text-danger fst-italic'>
                            <i>{errors.selectedRule}</i>
                          </small>
                        )}
                      </div>
                    )}
                    <div className='text-center'>
                      <button
                        type='button'
                        className='btn btn-primary mt-3 bg-dark'
                        onClick={validateEvaluation}
                      >
                        Evaluate
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <div className='col-lg-3'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;


