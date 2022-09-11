import fs from 'fs'
import * as web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"
import { initializeKeypair } from "./initializeKeypair"
import {
  bundlrStorage,
  findMetadataPda,
  keypairIdentity,
  Metaplex,
  toMetaplexFile,
} from "@metaplex-foundation/js"
import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata"

const tokenName = "BUILDOORS"
const tokenSymbol = "BLD"
const tokenDescription = "A token for buildoors"
const tokenImagePath = "tokens/bld/assets/unicorn.jpg"
const tokenImageFileName = "unicorn.jpg"

async function createBldToken(
  connection: web3.Connection,
  payer: web3.Keypair,
) {
  const tokenMint = await token.createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    2
  )

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payer))
    .use(bundlrStorage(
      {
        address: 'https://devnet.bundlr.network',
        providerUrl: connection.rpcEndpoint,
        timeout: 60000,
      }
    ))

  const imgBuffer = fs.readFileSync(tokenImagePath)
  const file = toMetaplexFile(imgBuffer, tokenImageFileName)
  const imgUri = await metaplex.storage().upload(file)
  const { uri } = await metaplex.nfts()
    .uploadMetadata({
      name: tokenName,
      description: tokenDescription,
      image: imgUri,
    })
    .run()

  const metadataPda = findMetadataPda(tokenMint)
  const tokenMetadata = {
    name: tokenName,
    symbol: tokenSymbol,
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2

  const tx = new web3.Transaction().add(
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPda,
        mint: tokenMint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV2: {
          data: tokenMetadata,
          isMutable: true,
        },
      }
    )
  )

  const txSig = await web3.sendAndConfirmTransaction(connection, tx, [payer])
  fs.writeFileSync(
    'tokens/bld/cache.json',
    JSON.stringify({
      mint: tokenMint.toBase58(),
      imageUri: imgUri,
      metadataUri: uri,
      tokenMetadata: metadataPda.toBase58(),
      metadataTransaction: txSig,
    })
  )
}

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
  const payer = await initializeKeypair(connection)
  await createBldToken(connection, payer)
}

main()
  .then(() => {
    console.log("Finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
