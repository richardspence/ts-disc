

import * as StackTrace from 'stacktrace-js';
import * as StackTraceGPS from 'stacktrace-gps';
import * as fs from 'fs';
import * as path from 'path';


async function parse(error: Error) {
    const stackFrames = await StackTrace.fromError(error);
    //console.log(stackFrames);
    return stackFrames;
}

async function resolve(stackFrames: StackTrace.StackFrame[]) {

    var gps = new StackTraceGPS({
        ajax: (url: string) => {
            let normalizedUrl = url;
            if (/^\./.test(url)) {
                normalizedUrl = path.join(__dirname, url);
            }
            return new Promise((resolve, reject) => {
                fs.readFile(normalizedUrl, 'utf8', (err, contents) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(contents);
                    }
                });
            });
        }
    });
    var newFrames: StackTrace.StackFrame[] = new Array(stackFrames.length)
    var frameResolved = 0;
    return new Promise<StackTrace.StackFrame[]>(resolve => {
        stackFrames.forEach(function (stackFrame, i) {
            gps.pinpoint(stackFrame).then(function (newFrame: StackTrace.StackFrame) {
                newFrames[i] = newFrame

                frameResolved++;
                if (frameResolved === stackFrames.length) {
                    resolve(newFrames);
                }
            }, function () {
                console.error(arguments)
            })
        });
    })

};

async function run(error: Error): Promise<void> {
    const frames = await parse(error);
    const newFrames = await resolve(frames);

    var newFrameStrings = newFrames.map(function (frame) {
        return frame.toString();
    })
    console.log('---original error---\n');
    console.log(error.stack);
    console.log('\n---mapped stack---\n');
    console.log(newFrameStrings.join("\n"))
}

run({
    stack: `Error: Arrgg
    at ErrorHelper.<anonymous> (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:54:23)
    at step (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:31:23)
    at Object.f [as next] (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:12:53)
    at __awaiter (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:6:71)
    at __awaiter (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:2:12)
    at ErrorHelper._throwsError (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:52:16)
    at ErrorHelper.<anonymous> (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:43:45)
    at step (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:31:23)
    at Object.f [as next] (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:12:53)
    at __awaiter (/Users/rspence/repos/ts-disc/dist/ErrorStacks.js:6:71)`,
    message: "TypeError: Cannot read property 'error' of undefined",
    name: 'UnhandledPromiseRejectionWarning'
});


