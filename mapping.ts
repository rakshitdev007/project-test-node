import { Transfer } from "./generated/ERC20/ERC20.ts"
import { Holder } from "./generated/schema.ts"
import { BigInt } from "@graphprotocol/graph-ts"

let ZERO = BigInt.fromI32(0)
let ZERO_ADDR = "0x0000000000000000000000000000000000000000"

function loadHolder(address: string, timestamp: BigInt): Holder {
    let holder = Holder.load(address)
    if (holder == null) {
        holder = new Holder(address)
        holder.balance = ZERO
    }
    holder.updatedAt = timestamp
    return holder
}

export function handleTransfer(event: Transfer): void {
    let amount = event.params.value
    let timestamp = event.block.timestamp

    // FROM
    if (event.params.from.toHex() != ZERO_ADDR) {
        let from = loadHolder(event.params.from.toHex(), timestamp)
        from.balance = from.balance.minus(amount)

        if (!from.balance.equals(ZERO)) {
            from.save()
        }
    }

    // TO
    if (event.params.to.toHex() != ZERO_ADDR) {
        let to = loadHolder(event.params.to.toHex(), timestamp)
        to.balance = to.balance.plus(amount)
        to.save()
    }
}
