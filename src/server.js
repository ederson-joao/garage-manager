const http = require('http');

const PORT = process.env.PORT || 3000;

const cars = [
    {id: 1, modelo: 'Fiesta', ano: 2010, marca_id:1, dono_id:1 },
    {id: 2, modelo: 'Uno', ano: 2015, marca_id:2, dono_id: 2}
];

const server = http.createServer((req, res) => {
    const { method, url } = req;
    console.log(`[${new Date().toISOString()}]${method} ${url}}`);

    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type' : 'text/plan; charset=utf-8'});
        res.end('Servidor Garage Manager rodando\n');
        return;
    }

    if (method === 'GET' && url === '/cars') {
        res.writeHead(200, { 'Content-Type' : 'application/json; charset=utf-8'});
        res.end(JSON.stringify(cars));
        return;
    }

    if (method === 'GET' && url.startsWith('/cars/')) {
        const idPart = url.split('/')[2];
        const id = Number(idPart);
        const car = cars.find(c => c.id === id);

         if (method === 'GET' && url.startsWith('/cars/search')) {
        const parseUrl = new URL(url, `http://${req.headers.host}`);
        const modeloParam = parseUrl.searchParams.get('modelo');

        if (!modeloParam) {
            res.writeHead(400, { 'Content-Type' : 'application/json; charset=utf-8'});
            res.end(JSON.stringify({ error: 'Parâmetro "modelo" é obrigatório'}));
            return;
        }

        const filtered = cars.filter((c) => 
        
        c.modelo.toLowerCase().includes(modeloParam.toLowerCase())
        );
        
        res.writeHead(200, { 'Content-Type' : 'application/json; charset=utf-8'});
        res.end(JSON.stringify(filtered));
        return;
    }

        if (!car) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Carro não encontrado' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(car));
        return;
    }

    if (method === 'POST' && req.url.startsWith( '/cars')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const newCar = JSON.parse(body);

                if (!newCar.modelo || !newCar.ano || !newCar.marca_id || !newCar.dono_id) {
                    res.writeHead(400, { 'Content-Type' : 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({ error: 'Campos obrigatórios faltando'}));
                    return;
                }

                newCar.id = cars.length ? cars[cars.length - 1].id + 1 : 1;
                cars.push(newCar);

                res.writeHead(201, { 'Content-Type' : 'application/json; charset=utf-8'});
                res.end(JSON.stringify(newCar));
            } catch(err) {
                res.writeHead(400, { 'Content-Type' : 'application/json; charset=utf-8'});
                res.end(JSON.stringify({ error: 'JSON inválido' }));
            }
        });

        return;
    }

   

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Rota não encontrada\n');
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});