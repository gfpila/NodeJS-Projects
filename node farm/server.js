const http = require("http");
const url = require("url");
const fs = require("fs");

//LER ARQUIVOS
const data = fs.readFileSync('dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);
const templateOver = fs.readFileSync('templates/overview.html', 'utf-8');
const templateProduct = fs.readFileSync('templates/template-product.html', 'utf-8');
const templateCard = fs.readFileSync('templates/card.html', 'utf-8');
const errorTemplate =  fs.readFileSync('templates/error.html', 'utf-8');

//FUNÇÃO GERAR TEMPLATE
const gerarTemplate = (template, product) => {

    let convertido = template.replace(/{pname}/g, product.productName);
    convertido = convertido.replace(/{pimage}/g, product.image);
    convertido = convertido.replace(/{pprice}/g, product.price);
    convertido = convertido.replace(/{pfrom}/g, product.from);
    convertido = convertido.replace(/{pnutrient}/g, product.nutrients);
    convertido = convertido.replace(/{pquantity}/g, product.quantity);
    convertido = convertido.replace(/{pdescription}/g, product.description);
    convertido = convertido.replace(/{pid}/g, product.id);

    if(!product.organic) {
    convertido = convertido.replace(/{not-organic}/g, 'not-organic');
    }
    return convertido

}


//SERVIDOR
const server = http.createServer((req, res) => {   

  const { query, pathname } = url.parse(req.url, true);
  console.log(pathname);

  //ROTA TESTE
  if(pathname == '/teste') {
    res.end("Im routed");
  }

  //ROTA MUNDO
  else if(pathname == '/mundo' || pathname == '/'){
    res.writeHead(200, {'Content-type': 'text-html'});
    const cardsHtml = dataObj.map(el => gerarTemplate(templateCard, el)).join('');
    //SUBSTITUIR PELOS CARDS
    const output = templateOver.replace(/{pcard}/, cardsHtml);
    res.end(output);
  }


  //ROTA API
  else if (pathname == '/api') {
    fs.readFile('./dev-data/data.json', 'utf-8', (err, data) => {
        parsedData = dataObj;
        console.log(parsedData);
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(`${data}`);
    })
  }
  //ROTA PRODUTOS
  else if (pathname == '/product')
  {
    const output = gerarTemplate(templateProduct, dataObj[query['id']])
    res.end(output)
  }

  //404
  else{
    res.writeHead(404);
    res.end(`${errorTemplate}`);
  }
});

//OUVIR
server.listen(8000, "127.0.0.1", () => {
  console.log("Ouvindo na porta 8000");
});