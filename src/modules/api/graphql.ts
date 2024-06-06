import {postAPI, requestAPI} from "@/modules/api/util";
import {
    AccountBalances,
    AccountHoldings,
    AccountInformationQuery,
    ContractCoreDetails,
    ContractExtendedFormatAPI,
    ContractQuery
} from "@/modules/api/contract-type";
import BigNumber from "bignumber.js";
import {ActionLogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {Balances, ContractBalance} from "@/modules/api/type";
import {GRAPH_CONFIG, LogTypes} from "@/modules/web3/constants";
import {priorityBonds} from "@/modules/web3/featured";
import {ethers} from "ethers";
import {getChain} from "@/modules/utils/chain";

const BOND_DETAILS_QUERY = `id
                    hash
                    uri
                    totalBonds
                    purchased
                    redeemed
                    isSettled
                    issuanceBlock
                    issuanceDate
                    issuer {
                      id
                    }
                    owner {
                      id
                    }
                    maturityPeriodInBlocks
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
                    earlyRedemptionRate
                    purchaseRate
                    referrerRewardRate`
const META_DETAILS = `_meta {
                        block {
                          number
                          timestamp
                        }
                      }`

const ACTION_LOGS = `actionLogs(orderBy: blockNumber, orderDirection: desc) {
                      blockNumber
                      count
                      from
                      id
                      to
                    }`

async function getContracts(params: ContractQuery): Promise<ContractCoreDetails[]> {
    const {chainId, contractAddresses} = params;

    const purchaseExists = Boolean(params.purchaseToken);
    const payoutExists = Boolean(params.payoutToken);

    const whereObject: any = {"issuanceBlock_gt": GRAPH_CONFIG[chainId].startBlock}

    if (purchaseExists) whereObject.purchaseToken = params.purchaseToken?.toLowerCase();
    if (payoutExists) whereObject.payoutToken = params.payoutToken?.toLowerCase();
    if (contractAddresses?.length) whereObject.id_in = contractAddresses.map(i => i.toLowerCase());

    const whereQuery = Object.keys(whereObject).reduce((acc, key, index) => {

        if (typeof whereObject[key] !== "object") {
            acc += `${key}: "${whereObject[key]}",`
        } else {
            acc += `${key}: ${JSON.stringify(whereObject[key])},`
        }
        return acc;
    }, "")

    const query = `
                    {
                      ${META_DETAILS}
                      bonds(
                      first: ${params.limit ?? 50}
                      skip: ${params.skip ?? 0}
                      orderBy: issuanceDate
                      orderDirection: desc
                      where: {${whereQuery}}
                      ) {
                        ${BOND_DETAILS_QUERY}
                      }
                    }
        `


    const response = await indexerRequest(chainId, query)

    const bonds: any = response.bonds;
    const block = response._meta.block.number;


    const contractsTransformed: ContractCoreDetails[] = bonds.map((item: any) => transformCoreDetails(item, chainId, block))
    const priorityBondsByChain = priorityBonds[chainId];

    contractsTransformed.sort((a, b) => {
        const aPriority = priorityBondsByChain[a.contractAddress.toUpperCase()];
        const bPriority = priorityBondsByChain[b.contractAddress.toLowerCase()]
        return (bPriority?.score || 0) - (aPriority?.score || 0)
    });

    return contractsTransformed;
}

async function getContractExtended(params: ContractQuery): Promise<ContractExtendedFormatAPI | null> {
    const {chainId, contractAddress, includeActionLogs} = params;
    const query = `
             { 
              ${META_DETAILS}
              bond(id: "${contractAddress?.toLowerCase()}") {
                    ${BOND_DETAILS_QUERY}
                    ${includeActionLogs ? ACTION_LOGS : ""}
                }
               }
            `


    const response = await indexerRequest(chainId, query)
    const block = response._meta.block.number;
    const bond = response.bond;
    const contractInfo = transformCoreDetails(bond, chainId, block);
    const actionLogs = transformActionDetails(bond)
    const contractDescription = await requestAPI({url: bond?.uri});

    const chain = getChain(chainId)
    if (!contractInfo) return null;


    return {
        contractDescription: {
            name: `Amet Finance | ${contractInfo.purchase.symbol}-${contractInfo.payout.symbol} | Fixed Flex | ${chain?.name}`,
            isInitiated: Boolean(contractDescription),
            ...(contractDescription || {})
        },
        contractInfo: contractInfo,
        actionLogs,
        lastUpdated: new Date().toString()
    }
}

async function getAccountInformation({chainId, address}: AccountInformationQuery): Promise<AccountHoldings> {
    // todo we can add historical purchases as well by removing balance_gt: "0"
    // todo can add action logs as well
    // referral and rewards as well

    const addressLowercase = address.toLowerCase()
    const query = `
    {
          ${META_DETAILS}
          user(id: "${addressLowercase}") {
            tokenBalances(where: {balance_gt: "0"}) {
              balance
              bond {
                ${BOND_DETAILS_QUERY}
              }
              purchaseBlock
              tokenId
            }
          }
          bonds(where: {owner_: {id: "${addressLowercase}"}} orderBy: issuanceDate orderDirection: desc) {
           ${BOND_DETAILS_QUERY}
          }
        }
`
    const response = await indexerRequest(chainId, query)


    const block = response?._meta?.block?.number || 0;
    const issued = (response?.bonds || []).map((item: any) => transformCoreDetails(item, chainId, block))

    const balances = (response?.user?.tokenBalances || [])
        .map((item: any) => {
            const bond = transformCoreDetails(item.bond, chainId, block);
            return {
                bond,
                balance: Number(item.balance),
                purchaseBlock: Number(item.purchaseBlock),
                tokenId: Number(item.tokenId)
            }
        }).sort((a: AccountBalances, b: AccountBalances) => b.purchaseBlock - a.purchaseBlock);

    return {
        balances,
        issued
    }
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


    return (userInfo?.tokenBalances || []).reduce((acc: Balances, item: any) => {
        const contractAddress: string = item.bond.id as string;
        const balanceInfo = {
            balance: Number(item.balance),
            purchaseBlock: Number(item.purchaseBlock),
            tokenId: Number(item.tokenId)
        }

        if (!acc[contractAddress]) {
            acc[contractAddress] = []
        }
        acc[contractAddress].push(balanceInfo);
        return acc;
    }, {} as Balances);
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
    const graphQlUrl = GRAPH_CONFIG[chainId].url;

    if (!graphQlUrl) {
        throw Error(`Indexer for ${chainId} is not supported!`)
    }

    const response = await postAPI({
        url: graphQlUrl,
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
        uri: item.uri,

        chainId,

        isSettled: item.isSettled,
        issuanceBlock: Number(item.issuanceBlock),
        issuanceDate: new Date(item.issuanceDate * 1000).toString(),
        issuer: item.issuer.id,
        owner: item.owner.id,

        totalBonds: Number(item.totalBonds),
        purchased: Number(item.purchased),
        redeemed: Number(item.redeemed),

        purchaseRate: Number(item.purchaseRate) / 10,
        earlyRedemptionRate: Number(item.earlyRedemptionRate) / 10,
        referrerRewardRate: Number(item.referrerRewardRate) / 10,

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
        if (log.from.toLowerCase() === ethers.constants.AddressZero.toLowerCase()) {
            type = LogTypes.Purchase
        } else if (log.to.toLowerCase() === ethers.constants.AddressZero.toLowerCase()) {
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
