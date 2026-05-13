const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");

const app = express();
const AVERAGE_TAX_RATE = 18;

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(session({
    secret:"PIMS",
    resave:false,
    saveUninitialized:false
}));

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    port:3306,
    database:"PIMS"
});
db.connect((err)=>{
    if(err){
        console.log(err);
    }else{ 
       console.log( "Database connected" );
    }
});

function isAuth(req,res,next){
    if(req.session.user){
        next()
    }else{
        res.status(401).json({ success:false, message:"login first" });
    }
}   
app.get("/profile", isAuth,(req,res)=>{
    res.json(req.session.user);
});
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.send("logged out");
});

app.post("/register", async(req,res)=>{
    const{username,password} = req.body;

    if(!username || !password){
        return res.status(400).json({ success:false, message:"Username and password are required" });
    }

    const hash = await bcrypt.hash(password,10);
    db.query("INSERT INTO user(username,password) VALUE (?,?)",[username,hash],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"registered failed" });
            }else{
                res.json({ success:true, message:"register successful" });
            }
        }
    )
});

app.post("/login",async(req,res)=>{

    const{ username , password } = req.body;

    db.query("SELECT * FROM user WHERE username=?",[username],
        async(err,result)=>{
            if(err){
               console.log(err);
               return res.status(500).json({ success:false, message:"failed" });
            }

            if(result.length === 0){
               return res.status(404).json({ success:false, message:"user not found" });
            }
            const user = result[0];
            const isMatch = await bcrypt.compare(password , user.password);
            if(!isMatch){
                res.status(401).json({ success:false, message:"login failed" });
            }else{
                req.session.user = user;
                res.json({ success:true, message:"login successful" });
            }
        }
    )
});

app.post("/category",isAuth ,async(req,res)=>{
    const{categoryId,categoryName,storageInstructions} = req.body;
    db.query("INSERT INTO category(categoryId,categoryName,storageInstructions) VALUE (?,?,?)",[categoryId,categoryName,storageInstructions],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json({ success:true, message:"Added" });
            }
        }
    )
});

app.get("/category",isAuth ,async(req,res)=>{
    db.query("SELECT * FROM category",
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json(result);
            }
        }
    )
});

app.put("/category/:categoryId",isAuth ,async(req,res)=>{
    const{categoryId} = req.params;
    const{categoryName,storageInstructions} = req.body;
    db.query("UPDATE category SET categoryName=?, storageInstructions=? WHERE categoryId=?",[categoryName,storageInstructions,categoryId],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json({ success:true, message:"Updated" });
            }
        }
    )
});

app.delete("/category/:categoryId",isAuth ,async(req,res)=>{
    const{categoryId} = req.params;
    db.query("DELETE FROM category WHERE categoryId=?",[categoryId],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json({ success:true, message:"Deleted" });
            }
        }
    )
});

app.post("/medicine",isAuth ,async(req,res)=>{
    const{medicineId,categoryId,tradeName,genericName,unitPrice} = req.body;
    db.query("INSERT INTO medicine(medicineId,categoryId,tradeName,genericName,unitPrice) VALUE (?,?,?,?,?)",[medicineId,categoryId,tradeName,genericName,unitPrice],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json({ success:true, message:"Added" });
            }
        }
    )
});

app.get("/medicine",isAuth ,async(req,res)=>{
    db.query("SELECT * FROM medicine",
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json(result);
            }
        }
    )
});

app.put("/medicine/:medicineId",isAuth ,async(req,res)=>{
    const{medicineId} = req.params;
    const{categoryId,tradeName,genericName,unitPrice} = req.body;
    db.query("UPDATE medicine SET categoryId=?, tradeName=?, genericName=?, unitPrice=? WHERE medicineId=?",[categoryId,tradeName,genericName,unitPrice,medicineId],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json({ success:true, message:"Updated" });
            }
        }
    )
});

app.delete("/medicine/:medicineId",isAuth ,async(req,res)=>{
    const{medicineId} = req.params;
    db.query("DELETE FROM medicine WHERE medicineId=?",[medicineId],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json({ success:true, message:"Deleted" });
            }
        }
    )
});

app.post("/inventoryStock",isAuth ,async(req,res)=>{
    const{stockNumber,medicineId,quantityInhand,expiryDate} = req.body;
    db.query("INSERT INTO inventoryStock(stockNumber,medicineId,quantityInhand,expiryDate) VALUE (?,?,?,?)",[stockNumber,medicineId,quantityInhand,expiryDate],
        (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json({ success:true, message:"Added" });
            }
        }
    )
});

app.get("/inventoryStock",isAuth ,async(req,res)=>{
    db.query("SELECT i.stockNumber, i.medicineId, m.tradeName, i.quantityInhand, i.expiryDate FROM inventoryStock i JOIN medicine m ON i.medicineId=m.medicineId",
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json(result);
            }
        }
    )
});

app.post("/sales",isAuth ,async(req,res)=>{
    const{saleNumber,medicineId,quantitySold,SaleDate} = req.body;
    const quantity = Number(quantitySold);

    if(!saleNumber || !medicineId || !SaleDate){
        return res.status(400).json({ success:false, message:"saleNumber, medicineId and SaleDate are required" });
    }

    if(!Number.isFinite(quantity) || quantity <= 0){
        return res.status(400).json({ success:false, message:"quantitySold must be greater than 0" });
    }

    const q = (sql, params=[]) => new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });

    const begin = () => new Promise((resolve, reject) => {
        db.beginTransaction((err) => err ? reject(err) : resolve());
    });

    const commit = () => new Promise((resolve, reject) => {
        db.commit((err) => err ? reject(err) : resolve());
    });

    const rollback = () => new Promise((resolve) => {
        db.rollback(() => resolve());
    });

    try {
        const medicineResult = await q("SELECT unitPrice FROM medicine WHERE medicineId=?",[medicineId]);

        if(medicineResult.length === 0){
            return res.status(404).json({ success:false, message:"medicine not found" });
        }

        const unitPrice = Number(medicineResult[0].unitPrice);
        const taxRate = AVERAGE_TAX_RATE;
        const subTotal = unitPrice * quantity;
        const totalAmount = subTotal + (subTotal * taxRate / 100);

        await begin();

        const stockRows = await q("SELECT stockNumber, quantityInhand FROM inventoryStock WHERE medicineId=? AND quantityInhand>0 ORDER BY expiryDate ASC",[medicineId]);
        const totalInHand = stockRows.reduce((sum, row) => sum + Number(row.quantityInhand), 0);

        if(totalInHand < quantity){
            await rollback();
            return res.status(400).json({ success:false, message:"not enough stock" });
        }

        let needed = quantity;
        for(const row of stockRows){
            if(needed <= 0){
                break;
            }

            const available = Number(row.quantityInhand);
            const take = Math.min(available, needed);
            await q("UPDATE inventoryStock SET quantityInhand=quantityInhand-? WHERE stockNumber=?",[take,row.stockNumber]);
            needed -= take;
        }

        await q("INSERT INTO sales(saleNumber,medicineId,quantitySold,totalAmount,SaleDate) VALUE (?,?,?,?,?)",[saleNumber,medicineId,quantity,totalAmount.toFixed(2),SaleDate]);
        await commit();

        res.json({ success:true, message:"Added", totalAmount:totalAmount.toFixed(2) });
    } catch (error) {
        await rollback();
        console.log(error);
        if(error && error.code === "ER_DUP_ENTRY"){
            return res.status(409).json({ success:false, message:"sale number already exists" });
        }
        res.status(500).json({ success:false, message:"failed" });
    }
});

app.get("/reports/bills",isAuth ,async(req,res)=>{
    db.query("SELECT s.saleNumber, m.tradeName, s.quantitySold, s.totalAmount, s.SaleDate FROM sales s JOIN medicine m ON s.medicineId=m.medicineId ORDER BY s.SaleDate DESC",
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json(result);
            }
        }
    )
});

app.get("/reports/daily",isAuth ,async(req,res)=>{
    const reportDate = req.query.date;
    const query = "SELECT m.tradeName, COALESCE(ds.quantitySold,0) AS quantitySold, COALESCE(st.remainingStock,0) AS remainingStock FROM medicine m LEFT JOIN (SELECT medicineId, SUM(quantitySold) AS quantitySold FROM sales WHERE SaleDate=? GROUP BY medicineId) ds ON m.medicineId=ds.medicineId LEFT JOIN (SELECT medicineId, SUM(quantityInhand) AS remainingStock FROM inventoryStock GROUP BY medicineId) st ON m.medicineId=st.medicineId ORDER BY m.tradeName";

    db.query(query,[reportDate],
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json({ success:false, message:"failed" });
            }else{
                res.json(result);
            }
        }
    )
});



app.listen(600,(req,res)=>{
    console.log("server is running on ports http://localhost:600");
});
