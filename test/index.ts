import { MinuetAuthoricate } from "minuet-server-authoricate";
import * as http from "http";

const ma = new MinuetAuthoricate({
    "/auth_area" : {
        user: "test",
        pass: "1234",
    },
});

http.createServer(async(req, res) => {

    const status = await ma.listen(req, res);
    if (status) return;

    res.write(".....Hallo!");
    res.end();   

}).listen(8829);

console.log("listen http://localhost:8829");