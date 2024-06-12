import { mnemonicToPrivateKey } from '@ton/crypto'
import {
	Address,
	JettonMaster,
	JettonWallet,
	TonClient,
	WalletContractV3R2,
	beginCell,
	toNano,
} from '@ton/ton'
import dotenv from 'dotenv'
import { SampleJetton } from '../wrappers/SampleJetton'
dotenv.config()

async function main() {
	const tonCenterRPCURL = process.env.TON_CENTER_RPC_URL || ''
	const client = new TonClient({
		endpoint: tonCenterRPCURL,
	})
	const mnemonics = process.env.TON_MNEMONIC || ''
	const keyPair = await mnemonicToPrivateKey(mnemonics.split(' '))
	const wallet = WalletContractV3R2.create({
		workchain: 0,
		publicKey: keyPair.publicKey,
	})
	const walletContract = client.open(wallet)
	const sender = walletContract.sender(keyPair.secretKey)

	const address = walletContract.address
	console.log('address', address)

	const balance = await client.getBalance(address)
	console.log('balance', balance)

	// const escrow = client.open(await SampleJetton.fromInit())
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
