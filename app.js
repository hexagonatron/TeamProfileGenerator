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
});