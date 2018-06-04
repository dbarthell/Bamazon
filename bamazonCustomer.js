var mysql = require("mysql");
var inquirer = require("inquirer");
var key = require("./key.js");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: key.key,
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "list",
                message: "Which mystery product would you like to buy?",
                choices: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                ],
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy? ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT product_name, department_name, price, stock_quantity FROM products WHERE item_id = ?";
            connection.query(query, [answer.product], function (err, res) {
                console.log(res);
                if (res[0].stock_quantity < 0) {
                    console.log("Out of stock!");
                    return;
                } else
                    console.log(
                        "=================================" +
                        "\nProduct: " +
                        res[0].product_name +
                        "\nDepartment: " +
                        res[0].department_name +
                        "\nTotal Cost: " +
                        res[0].price +
                        "\nStock Before Purchase: " +
                        res[0].stock_quantity +
                        "\n================================="
                    );
                    connection.query("UPDATE products SET stock_quantity = ?", [res[0].stock_quantity - answer.quantity]);
            });
            runSearch();
        });
}