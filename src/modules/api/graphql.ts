import {postAPI, requestAPI} from "@/modules/api/util";
import {
    AccountInformationQuery,
    ContractCoreDetails,
    ContractExtendedFormatAPI,
    ContractQuery
} from "@/modules/api/contract-type";
import BigNumber from "bignumber.js";
import {ActionLogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {constants} from "amet-utils";
import {Balances, ContractBalance} from "@/modules/api/type";
import {LogTypes} from "@/modules/web3/constants";
import {StringKeyedObject} from "@/components/utils/general";
import {base} from "wagmi/chains";

function getApi(chainId: number) {
    const API: StringKeyedObject<string> = {
        [base.id]: `https://subgraph.satsuma-prod.com/10c8c7e96744/unconstraineds-team--970943/Amet-Finance-8453/version/0.5.2/api`
    }
    return API[chainId];
}


async function getContracts(params: ContractQuery): Promise<ContractCoreDetails[]> {
    const {chainId} = params;
    const query = `
                    {
                      _meta {
                        block {
                          number
                          timestamp
                        }
                      }
                      bonds(first: ${params.limit ?? 50}, skip: ${params.skip ?? 0} orderBy: issuanceDate, orderDirection: desc) {
                        id
                        isSettled
                        uri
                        issuanceBlock
                        issuanceDate
                        maturityPeriodInBlocks
                        issuer {
                          id
                        }
                        owner {
                          id
                        }
                        payoutAmount
                        payoutToken {
                          decimals
                          name
                          id
                          symbol
                        }
                        purchaseToken {
                          decimals
                          id
                          name
                          symbol
                        }
                        payoutBalance
                        purchaseAmount
                        purchased
                        redeemed
                        totalBonds
                      }
                    }
        `

    const response = await indexerRequest(chainId, query)

    const bonds: any = response.bonds;
    const block = response._meta.block.number;

    return bonds.map((item: any) => transformCoreDetails(item, chainId, block)) as ContractCoreDetails[]
}

async function getContractExtended(params: ContractQuery): Promise<ContractExtendedFormatAPI | null> {
    const {chainId, contractAddress} = params;
    const query = `
             { 
             _meta {
                block {
                  number
                  timestamp
                }
              }
              bond(id: "${contractAddress?.toLowerCase()}") {
                    id
                    isSettled
                    uri
                    issuanceBlock
                    issuanceDate
                    issuer {
                      id
                    }
                    maturityPeriodInBlocks
                    owner {
                      id
                    }
                    payoutAmount
                    payoutBalance
                    payoutToken {
                      decimals
                      id
                      name
                      symbol
                    }
                    purchaseAmount
                    purchaseToken {
                      decimals
                      name
                      id
                      symbol
                    }
                    purchased
                    redeemed
                    totalBonds
                    actionLogs {
                      blockNumber
                      count
                      from
                      id
                      to
                    }
                  }
                }
            `


    const response = await indexerRequest(chainId, query)
    const block = response._meta.block.number;
    const bond = response.bond;
    const contractInfo = transformCoreDetails(bond, chainId, block);
    const actionLogs = transformActionDetails(bond)
    const contractDescription = await requestAPI({url: bond?.uri});
    if (!contractInfo) return null;


    return {
        contractDescription: {
            name: `Amet Finance | ${contractInfo.purchase.symbol}-${contractInfo.payout.symbol} | Fixed Flex`,
            isInitiated: Boolean(contractDescription),
            ...(contractDescription || {})
        },
        contractInfo: contractInfo,
        actionLogs,
        lastUpdated: new Date().toString()
    }
}

async function getAccountInformation(params: AccountInformationQuery) {
    const addressLowercase = params.address.toLowerCase()
    const query = `
    {
          user(id: "${addressLowercase}") {
            tokenBalances(where: {balance_gt: "0"}) {
              balance
              bond {
                id
                isSettled
                issuanceBlock
                issuanceDate
                issuer {
                  id
                }
                maturityPeriodInBlocks
                owner {
                  id
                }
                payoutAmount
                payoutBalance
                payoutToken {
                  decimals
                  id
                  name
                  symbol
                }
                purchaseAmount
                purchaseToken {
                  decimals
                  id
                  name
                  symbol
                }
                purchased
                redeemed
                totalBonds
                uri
              }
              purchaseBlock
              tokenId
            }
          }
          bonds(where: {owner_: {id: "${addressLowercase}"}}) {
            id
            isSettled
            issuanceBlock
            issuanceDate
            issuer {
              id
            }
            maturityPeriodInBlocks
            owner {
              id
            }
            payoutAmount
            payoutBalance
            payoutToken {
              decimals
              id
              name
              symbol
            }
            purchaseAmount
            purchaseToken {
              decimals
              id
              name
              symbol
            }
            purchased
            redeemed
            totalBonds
            uri
          }
          _meta {
            block {
              number
              timestamp
            }
          }
        }
`
    const response = await indexerRequest(params.chainId, query)

    console.log(response)
}

async function getBalances(address: string, chainId: number): Promise<Balances> {
    const query = `{
              user(id: "${address.toLowerCase()}") {
                tokenBalances(where: {balance_gt: "0"}) {
                  balance
                  tokenId
                  bond {
                    id
                  }
                  purchaseBlock
                }
              }
            }`

    const response = await indexerRequest(chainId, query);
    const userInfo = response.user;

    const balances: Balances = {}
    userInfo.tokenBalances.forEach((item: any) => {
        const contractAddress: string = item.bond.id as string;
        const balanceInfo = {
            balance: Number(item.balance),
            purchaseBlock: Number(item.purchaseBlock),
            tokenId: Number(item.tokenId)
        }

        if (!balances[contractAddress]) {
            balances[contractAddress] = []
        }
        balances[contractAddress].push(balanceInfo);
    })
    return balances;
}

async function getBalance(address: string, bondAddress: string, chainId: number): Promise<ContractBalance[]> {
    const query = `{
              user(id: "${address.toLowerCase()}") {
                tokenBalances(where: {balance_gt: "0", bond_: {id: "${bondAddress.toLowerCase()}"}}) {
                  balance
                  tokenId
                  purchaseBlock
                }
              }
            }`

    const response = await indexerRequest(chainId, query)
    const userInfo: any = response.user;
    return userInfo.tokenBalances.map((item: any) => ({
        balance: Number(item.balance),
        purchaseBlock: Number(item.purchaseBlock),
        tokenId: Number(item.tokenId)
    }))
}

async function indexerRequest(chainId: number, query: string): Promise<any> {
    if (!getApi(chainId)) {
        throw Error(`Indexer for ${chainId} is not supported!`)
    }

    const response = await postAPI({
        url: getApi(chainId),
        body: {query}
    });

    if (!response?.data) {
        throw Error("Indexer response is missing")
    }

    return response.data;
}

function transformCoreDetails(item: any, chainId: number, block: string): ContractCoreDetails | null {
    if (!item) return null;

    return {
        block: Number(block),
        contractAddress: item.id,
        chainId,

        isSettled: item.isSettled,
        issuanceBlock: Number(item.issuanceBlock),
        issuanceDate: new Date(item.issuanceDate * 1000).toString(),
        issuer: item.issuer.id,
        owner: item.owner.id,

        totalBonds: Number(item.totalBonds),
        purchased: Number(item.purchased),
        redeemed: Number(item.redeemed),

        payoutBalance: item.payoutBalance as string,
        maturityPeriodInBlocks: Number(item.maturityPeriodInBlocks),
        payout: {
            chainId: chainId,
            contractAddress: item.payoutToken.id as string,
            decimals: item.payoutToken.decimals as number,
            symbol: item.payoutToken.symbol as string,
            name: item.payoutToken.name as string,
            isVerified: false,
            amount: item.payoutAmount as string,
            amountClean: BigNumber(item.payoutAmount).div(BigNumber(10).pow(BigNumber(item.payoutToken.decimals))).toNumber()
        },
        purchase: {
            chainId: chainId,
            contractAddress: item.purchaseToken.id as string,
            decimals: item.purchaseToken.decimals as number,
            symbol: item.purchaseToken.symbol as string,
            name: item.purchaseToken.name as string,
            isVerified: false,
            amount: item.purchaseAmount as string,
            amountClean: BigNumber(item.purchaseAmount).div(BigNumber(10).pow(BigNumber(item.purchaseToken.decimals))).toNumber()
        }
    }
}

function transformActionDetails(item: any): ActionLogFormat[] {
    if (!item) return []
    const logs = item.actionLogs || [];

    return logs.map((log: any) => {

        let type = LogTypes.Transfer;
        if (log.from.toLowerCase() === constants.AddressZero.toLowerCase()) {
            type = LogTypes.Purchase
        } else if (log.to.toLowerCase() === constants.AddressZero.toLowerCase()) {
            type = LogTypes.Redeem
        }

        return {
            id: log.id,
            from: log.from,
            to: log.to,
            count: Number(log.count), // 25 tokens
            type: type,
            block: log.blockNumber
        }
    })
}

const GraphqlAPI = {
    getContracts,
    getContractExtended,
    getBalance,
    getBalances,
    getAccountInformation
}
export default GraphqlAPI;
