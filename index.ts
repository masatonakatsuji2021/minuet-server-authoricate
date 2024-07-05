/**
 * MIT License
 * 
 * Copyright (c) 2024 Masato Nakatsuji
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

import { IncomingMessage, ServerResponse } from "http";
import { MinuetServerModuleBase } from "minuet-server";

export interface MinuetAuthoricateOptions {
    [url : string] : MinuetAuthoricateOption,
}
export interface MinuetAuthoricateOption {
    user: string,
    pass: string,
    failureMessage? : string,
}

export class MinuetAuthoricate {

    private authoricates : MinuetAuthoricateOptions;

    public constructor(authoricates? : MinuetAuthoricateOptions) {
        this.authoricates = authoricates;
    }

    public async listen(req: IncomingMessage, res: ServerResponse<IncomingMessage>) : Promise<boolean> {
        const url : string = req.url.split("?")[0];
        const c = Object.keys(this.authoricates);
        let decisionAuthoricate : MinuetAuthoricateOption;
        for (let n = 0 ; n < c.length ; n++){
            const targetUrl : string = c[n];
            const authoricate : MinuetAuthoricateOption = this.authoricates[targetUrl];

            if ((url + "/").indexOf(targetUrl + "/") === 0) {
                decisionAuthoricate = authoricate;
                break;
            }
        }

        if (!decisionAuthoricate) return false;

        const encodedCredentials = Buffer.from(decisionAuthoricate.user + ":"+ decisionAuthoricate.pass).toString('base64');
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Basic ')) {
            const credentials = authHeader.split(' ')[1];            
            if (credentials === encodedCredentials) {
                return false;
            }
        }

        res.statusCode = 401;
        res.setHeader("WWW-Authenticate", "Basic realm=\"Authoricate\"");
        if (!decisionAuthoricate.failureMessage) decisionAuthoricate.failureMessage = "Authentication failure";
        res.write(decisionAuthoricate.failureMessage);
        res.end();

        return true;
    }
}

export class MinuetServerModuleAuthoricate extends MinuetServerModuleBase {

    private authoricate : MinuetAuthoricate;

    public onBegin(): void {
        this.authoricate = new MinuetAuthoricate();
    }

    public async onListen(req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<boolean> {
        return await this.authoricate.listen(req, res);
    }
}