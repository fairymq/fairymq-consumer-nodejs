/*
* fairyMQ Node.JS Consumer
* ******************************************************************
* Copyright (C) fairyMQ
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import EventEmitter from 'node:events'
import * as fs from 'node:fs'
import * as dgram from 'node:dgram'
import crypto from 'crypto'

function splitBuf(b, sep) {
    const ret = [];
    let s = 0;
    let i = b.indexOf(sep, s);
    while (i >= 0) {
        if (i >= 0) {
            ret.push(b.slice(s, i));
        }
        s = i + 1;
        i = b.indexOf(sep, s);
    }
    ret.push(b.slice(s));
    return ret;
}


class Consumer {

    constructor(privateKey) {
        this.privateKey = fs.readFileSync(privateKey).toString()
        this.server = dgram.createSocket('udp4')
        this.events = new EventEmitter()
        this.port = 5992
    }

    SetPort(port) {
        this.port = port
    }

    Listen() {
        let obj = this

        let lastTimestamp = 0;

        this.server.on('error', (err) => {
            console.error(`server error:\n${err.stack}`)
            server.close()
        })

        this.server.on('message', (msg, rinfo) => {

            const decrypted = crypto.privateDecrypt(
                {
                    key: this.privateKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                msg
            )

            if (lastTimestamp === decrypted.toString().split("\r\n")[1]) {
                return
            }

            lastTimestamp = decrypted.toString().split("\r\n")[1]
            const bufferArray = splitBuf(decrypted, "\r\n")
            obj.events.emit('event', bufferArray[bufferArray.length-1].slice(1))
        })

        this.server.on('listening', () => {
            const address = this.server.address()
            console.log(`Consumer listening ${address.address}:${address.port}`)
        })

        this.server.bind(this.port)
    }

}

export default Consumer