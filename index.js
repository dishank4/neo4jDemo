var koa = require('koa');
var koaBody = require('koa-body');
var router = require('koa-router')();
var neo4j = require('neo4j-driver').v1;
var app = new koa();
app.use(koaBody())

// Create a driver instance, for the user neo4j with password neo4j. 
// It should be enough to have a single driver per database per application. 
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "123"));

// Register a callback to know if driver creation was successful: 
driver.onCompleted = function () {
 // proceed with using the driver, it was successfully instantiated 
};

// Register a callback to know if driver creation failed. 
// This could happen due to wrong credentials or database unavailability: 
driver.onError = function (error) {
 console.log('Driver instantiation failed', error);
};

// Close the driver when application exits. 
// This closes all used network connections. 
driver.close();


var session = driver.session();

router.get('/',function(ctx){
    ctx.body = 'this is simple request';
})

router.get('/users',async function(ctx){
    var resp = await session.run("MATCH(u:user) return collect({user : u.name , role : u.role , id:id(u)} )");
    ctx.body = resp.records[0]._fields;
})

router.post('/addUser', async function(ctx){
    var resp = await session.run("CREATE (n:user { name: {name}, role: {role} })", ctx.request.body);
    if(ctx.request.body && ctx.request.body.parent){
      var resp1 =  await session.run("MATCH (a:user),(b:user) WHERE a.name = {parent} AND b.name = {name}  CREATE (a)-[r:hasChild]->(b) RETURN r",ctx.request.body);
    }
    ctx.body = {"resp" : resp};
    if(resp1){
        ctx.body['resp1'] = resp1;
    }
})

router.post('/getChieldByUser' , async function(ctx){
    var name = ctx.request.body.name;

    //param.put("name",name); 
    var resp = await session.run("MATCH (a:user)-[r:hasChild*1..]->(b:user) WHERE a.name = {name}  return {parent:a.name,child : {name :collect( b.name)}}",{'name' : name});
    ctx.body = resp.records[0]._fields;
})

router.post('/deleteUser', async function(ctx){
    var resp = await session.run("MATCH (n { name: {name} }) DETACH DELETE n",ctx.request.body);
    ctx.body = resp;
})

app.use(router.routes())

app.listen(5050,function(){
    console.log('app is running on 5050');
})