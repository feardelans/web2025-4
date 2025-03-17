const { program } = require('commander');
const http = require('http');
const fs = require('fs').promises;
const { Builder } = require('xml2js');

// Налаштування командного рядка
program
    .requiredOption('-h, --host <host>', 'Server host')
    .requiredOption('-p, --port <port>', 'Server port')
    .requiredOption('-i, --input <file>', 'Path to input JSON file');

program.parse(process.argv);
const options = program.opts();

// Функція для читання JSON-файлу та конвертації в XML
async function processJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(data);

        // Перевіряємо, чи JSON є масивом
        if (!Array.isArray(jsonData)) {
            throw new Error('Invalid JSON format: expected an array');
        }

        // Формуємо XML-структуру
        const builder = new Builder({ headless: true });
        const xmlData = {
            data: {
                auction: jsonData.map(entry => ({
                    code: entry.StockCode,
                    currency: entry.ValCode,
                    attraction: entry.Attraction
                }))
            }
        };

        return builder.buildObject(xmlData);

    } catch (error) {
        console.error('❌ Error processing JSON file:', error.message);
        return null;
    }
}

// Створюємо HTTP-сервер
const server = http.createServer(async (req, res) => {
    const xmlResponse = await processJSONFile(options.input);

    if (xmlResponse) {
        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.end(xmlResponse);
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('❌ Error processing JSON file');
    }
});

// Запускаємо сервер
server.listen(options.port, options.host, () => {
    console.log(` Server running at http://${options.host}:${options.port}/`);
});
