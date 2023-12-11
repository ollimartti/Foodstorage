
import express, { request } from "express";
import mysql from "mysql";
import http from "http";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var con = mysql.createConnection({
    host: "localhost",
    database: "foodstoragedb",
    user:  "username",
    password: "password",
    dateStrings: true,
    timezone : "+00:00"
});


con.connect((err) => {
    if (err) 
    {
        console.log(err)
    }else{
        console.log("Connected!");
    }
});
  
        // Load Home page

app.get("/",(req, res) => {
    res.render("index.ejs");
});

        // Load EAN code edit page

app.get("/eanadd", (req, res) => {
    res.render("eanadd.ejs");
});

        // Load product code edit page

app.get("/editlist", (req, res) => {
    res.render("editlist.ejs");
});



app.post("/code", (req, res) => {
    const eanText = req.body.ean_code;

    //console.log(eanText);

    var searchText = eanText;
    var r;
    var pName;
    var pGroup;
    var result;

    con.query(('SELECT product_name, product_group FROM product_code_tbl WHERE ean_code LIKE ' + "'"+searchText+"%'"), function(err, result){
        if(err)
        {
            console.log(err)

        }else{

            if(result.length){
                r = JSON.parse(JSON.stringify(result))
                pName = r[0].product_name;
                pGroup = r[0].product_group;                
            }else{
                console.log("nok");
                pName = "! ! ! EAN-koodia ei löydy. Lisää uusi koodi kantaan."
                }
            res.render("editlist.ejs", {pName, pGroup});
        }
    }) 
    return;
});

        // Add new product row to product_tbl

app.post("/post", (req, res) => {

    var id;
    const item2 = req.body.prod_item;
    const pvm2 = req.body.prod_pvm;
    const prod_group2 = req.body.prod_group;
    con.query('INSERT INTO product_tbl VALUES (?,?,?,?)',
                [id,item2,pvm2,prod_group2], (err, result) => {
            if(err)
            {
                console.log(err);
            }else{
                return         
            }
        })
    res.render("editlist.ejs");
});

    // Add new EAN row to product_code_tbl

app.post("/ean", (req, res) => {

    const ean_code2 = req.body.ean_code;
    const product_name2 = req.body.product_name;
    const product_group2 = req.body.product_group;
        con.query('INSERT INTO product_code_tbl VALUES (?,?,?)',
                [ean_code2,product_name2,product_group2], (err, result) => {
            if(err)
            {
                console.log(err);
            }else{
                return           
            }
        })
    res.render("eanadd.ejs");
});


        // Delete row from product_tbl (editlist)

app.post("/del", (req, res) => {
    const id2 = req.body.id;
    con.query('DELETE FROM product_tbl WHERE id=(?)', 
                [id2], (err, result) => {
                    //console.log(id2);
            if(err)
            {
                console.log(err);
            }else{
                return     
            }
        }) 

    res.render("editlist.ejs");
});



        // Fetch data from product_tbl (home, editlist )

app.get("/list", (req, res) => {
    
    var r;
    var result;
    con.query('SELECT id,prod_item, prod_group, prod_pvm FROM product_tbl ORDER BY prod_pvm',
    function (err, result, fields) {
        if (err) 
        {
            console.log(err);
        }
        else{
            r = JSON.parse(JSON.stringify(result))
             //console.log(r);
            res.send(r);
            }
    });
    return
});

        // Fetch data from product_code_tbl to (eanadd)

app.get("/items", (req, res) => {

    var r;
    var result;
    con.query('SELECT ean_code,product_name, product_group FROM product_code_tbl ORDER BY ean_code',
    function (err, result, fields) {
        if (err) 
        {
            console.log(err);
        }
        else{
            r = JSON.parse(JSON.stringify(result))
                //console.log(r);
            res.send(r);
            }
    });
    return
});


app.listen(3000,(err) => {
    if(err)
    {
        console.log(err)
    }else{
        console.log("on port 3000")
    }
});

