const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

const makeManager = () => {
    return new Promise((res, rej) => {
        inquirer.prompt([
            {
                message: "What is your managers name?",
                name: "name"
            },
            {
                message: "What is their ID?",
                name: "id"
            },
            {
                message:`What is their email address?`,
                name: "email"
            },
            {
                message: "What is their office number?",
                name: "officeNumber"
            }
        ]).then(answers => {
            const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            employees.push(manager);
            res();
        })
    })
}

const makeEmployee = () => {
    return new Promise((resolve, rej) => {
        inquirer.prompt([
            {
                message:"Which employee would you like to add next?",
                type: "list",
                name: "employeeType",
                choices: [
                    "Engineer",
                    "Intern",
                    {
                        name: "I'm done adding employees",
                        value: false
                    }
                ]
            },
            {
                message: "What is their name?",
                name: "name",
                when: ({employeeType}) => employeeType
            },
            {
                message: "What is their ID?",
                name: "id",
                when: ({employeeType}) => employeeType
            },
            {
                message:"What is their email address?",
                name: "email",
                when: ({employeeType}) => employeeType
            },
            {
                message: "what is their GitHub username?",
                name: "github",
                when: ({employeeType}) => employeeType === "Engineer"
            },
            {
                message: "Which school are they from?",
                name: "school",
                when: ({employeeType}) => employeeType === "Intern"
            }
        ]).then(answers => {
            if(answers.employeeType){
                switch (answers.employeeType) {
                    case "Engineer":
                        const eng = new Engineer(answers.name, answers.id, answers.email, answers.github);
                        employees.push(eng);
                        break;
                    case "Intern":
                        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
                        employees.push(intern);
                        break;
                }
                return makeEmployee().then(() => resolve());
            } else {
                return resolve()
            }
        })
    })
}

const createHTMLFile = (html) => {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, html, "utf-8", (err) => {
        if(err) throw err;
        console.log(`Team profile sucessfully generated in ${outputPath}`)
    });
}



makeManager()
.then(() => {
    return makeEmployee()
})
.then(() => {
    const templateHTML = render(employees)
    createHTMLFile(templateHTML);
}).catch((err) => {
    console.log(err);
})


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)



// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
