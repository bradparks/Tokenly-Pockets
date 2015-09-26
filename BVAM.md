## Blockchain Validated Asset Metadata

_Note: The terms 'asset' and 'token' can be used interchangeably_

Blockchain Validated Asset Metadata (BVAM) is a method which allows [Counterparty](http://counterparty.io) Asset metadata to be stored off-blockchain as JSON data, yet still be verifiable and inalterable by storing the hash of the JSON data in the Counterparty Asset description.

BVAM must define, at a minimum, the 'asset' element within the JSON data.  This conforms to the current Counterparty Enhanced Asset Info [documentation](http://counterparty.io/docs/enhanced_asset_info/).  Additional elements can also be customized to meet the needs of each wallet provider.  Elements should be listed in alphabetical order to ensure repeatability of the JSON data hash.

There are two methods for storing BVAM JSON data which are recognized by the Pockets wallet, server method (via [xcp.ninja](http://xcp.ninja)) and p2p method (via [Webtorrent](http://webtorrent.io) protocol) 

Example BVAM json, http://xcp.ninja/hash/TB2rTB5FdLtqYu31wTmKgy54TYeZSqJgr3.json

Referenced Counterparty Asset, https://counterpartychain.io/asset/A11161111624187815485

### Server Method

1.  A third party service(s) hosts a JSON file with Enhanced Asset info (this is inline with the current protocol).  For Tokenly Pockets, this is currently limited to [xcp.ninja](http://xcp.ninja) only.

2.  When issuing a new asset in Counterparty, the asset description references the hash of the stringify'd enhanced asset JSON data (instead of referencing the URL of the JSON file in the asset description).  To save space, the SHA256 hash is encoded, similar to a bitcoin public key but with the version numbered altered to display a "T" as the first character instead of a "1".

    *Example BVAM hash:  TB2rTB5FdLtqYu31wTmKgy54TYeZSqJgr3*
    
        var jsondata = '{"ownername":"ABC Inc.","ownertwitter":"@abcinc","owneraddress":"1GcFhAQGFZVDAr4jiR2tKwisHcgNUjhGNC","asset":"A11161111624187815485","assetname":"Widget","assetdescription":"Good for one widget.","assetwebsite":"http://abcwidgets.com"}'
        
        var firstSHA = Crypto.SHA256(jsondata)

        var hash160 = Crypto.RIPEMD160(Crypto.util.hexToBytes(firstSHA))
        var version = 0x41 // "T"
        var hashAndBytes = Crypto.util.hexToBytes(hash160)
        hashAndBytes.unshift(version)

        var doubleSHA = Crypto.SHA256(Crypto.util.hexToBytes(Crypto.SHA256(hashAndBytes)))
        var addressChecksum = doubleSHA.substr(0,8)

        var unencodedAddress = "41" + hash160 + addressChecksum

        var address = Bitcoin.Base58.encode(Crypto.util.hexToBytes(unencodedAddress))
        
    http://jsfiddle.net/k0jk49km/


3. The hash is prefixed in the asset description with "TOKNID-" for wallet software to identify that an asset has associated BVAM.  This represents a 41-byte asset description.  

    *Example Asset Description:  TOKNID-TB2rTB5FdLtqYu31wTmKgy54TYeZSqJgr3*

4.  Wallet software can query any third party service and trust that the data is valid without the need to trust the source.  This is accomplished by independently verifying the data hash within the wallet using the method in Step 2.

### p2p Method  

BVAM via Webtorrent can be enabled in the Wallet Settings tab of Tokenly Pockets. Once downloaded, Pockets caches BVAM locally for future reference.

1.  Token issuers seed BVAM JSON files with Enhanced Asset info via Webtorrent.  BVAM creation and seeding is currently available at [xcp.ninja](http://xcp.ninja).

2.  When issuing a new asset in Counterparty, the asset description references the Webtorrent infohash of the enhanced asset JSON file named BVAMWT.json which contains BVAM unique to that asset.  To save space, the Webtorrent infohash is Base58 encoded.

3.  The hash is prefixed in the asset description with "BVAMWT-" for wallet software to identify that an asset has an associated BVAM Webtorrent.  

    *Example Asset Description:  BVAMWT-4SL14zw8RoTco96bTwtdKwnXGXcZ*

4.  Wallet software can Base58 decode the infohash and query Webtorrent peers to download BVAM.  