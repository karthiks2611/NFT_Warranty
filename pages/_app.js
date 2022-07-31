import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return(
    <div>
    <nav className="border-b p-6 bg-blue-800">
      <img src="https://media.glassdoor.com/sqll/300494/flipkart-com-squarelogo-1433217726546.png" alt="Logo" className="inline-block object-scale-down object-cover h-20 w-20"/>
      <p className="text-4xl font-bold text-yellow-500 inline-block ">Flipkart Warranty Center</p>
      <div className="flex mt-4">
        <Link href="/">
          <a className="mr-4 text-white">
            Warranty Market
          </a>
        </Link>
        <Link href="/create-nft">
          <a className="mr-6 text-white">
            Create NFT Warranty
          </a>
        </Link>
        <Link href="/my-nfts">
          <a className="mr-6 text-white">
            My NFT Warranties
          </a>
        </Link>
        <Link href="/dashboard">
          <a className="mr-6 text-white">
            Check Ownership & Authenticity
          </a>
        </Link>
        <Link href="/transfer">
          <a className="mr-6 text-white">
            Transfer Warranty
          </a>
        </Link>
      </div>
    </nav>
 <Component {...pageProps} />
    </div>
  )
}

export default MyApp
