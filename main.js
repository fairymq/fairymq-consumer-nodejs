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

import net from 'node:net'
import EventEmitter from 'node:events'
import * as fs from 'node:fs'
import * as dgram from 'node:dgram'
import crypto from 'crypto'

class Consumer {

    constructor(privateKey) {
        this.privateKey = fs.readFileSync(privateKey).toString()
        this.server = dgram.createSocket('udp4')
        this.events = new EventEmitter()
    }

    Listen() {
        let obj = this

        this.server.on('error', (err) => {
            console.error(`server error:\n${err.stack}`)
            server.close()
        })

        this.server.on('message', (msg, rinfo) => {

            const decrypted = crypto.privateDecrypt(
                {
                    key: this.privateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: "sha256",
                },
                msg
            )
            obj.events.emit('event', decrypted)
        })

        this.server.on('listening', () => {
            const address = this.server.address()
            console.log(`Consumer listening ${address.address}:${address.port}`)
        })

        this.server.bind(5992)
    }

}

export default Consumer