import app from "./app";
import { SeedersImport } from "./database/mongodb/seeders-import";
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
    SeedersImport.importProducts(data => console.log(`> Products fixtures have been imported: ${JSON.stringify(data)}`));
    SeedersImport.importUsers(data => console.log(`> Users fixtures have been imported: ${JSON.stringify(data)}`));
    SeedersImport.importCities(data => console.log(`> Cities fixtures have been imported: ${JSON.stringify(data)}`));
});
