const Employee = require("./Employee")

class Engineer extends Employee{
    constructor(name, id, email, gitHubUserName){
        super(name, id, email);

        this.role = "Engineer";
        this.github = gitHubUserName
    }

    getGithub(){
        return this.github;
    }
}

module.exports = Engineer;