import React, { useState, useEffect, useReducer } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Image,
  ImageBackground,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import LoyaltyPayment from './components/LoyaltyPayment';
import LoyaltyNFT from './components/LoyaltyNFT';
import ListNFT from './components/ListNFT';
import ListCrypto from './components/ListCrypto';
import DealModal from './components/DealModal';

import NfcManager, { NfcEvents, Ndef, NfcTech } from 'react-native-nfc-manager';
import { PaperProvider, 
  Appbar, 
  Button, Dialog, Portal, Text, Title, Paragraph, DataTable, Surface, 
  Card, ProgressBar, List, Chip,
  Avatar, SegmentedButtons, Divider
} from 'react-native-paper';

import {
  Tabs,
  TabScreen,
  TabsProvider,
  useTabIndex,
  useTabNavigation,
} from 'react-native-paper-tabs'; 

import NFTModal from './components/NFTModal';

const USER_ID = '';
const CANISTER = "";
const DOMAIN = "raw.icp0.io";
const ADDRESS_BITCOIN = "";


interface orderState {
  step: number;
  steps: {};
  tag: string;
  deal: number;
  redeemed: boolean;
  selected: number;
  tip: number,
  order: number,
  confirmation: number,
  amount: number;
  show: boolean;
  deals: {};
  crypto_prices: {};
  crypto_holdings: {};
}

interface orderFlows {
  loyalty: {
    type: string,
    steps: number,
    step_description: [],
    
  },
  coupon: {
    type: string,
    steps: number,
    step_description: []
  },
  ticket: {
    type: string,
    steps: number,
    step_description: []
  }
}


function App(): React.JSX.Element {

  let paymentMethodObj = {
    id: 0,
    title: 'Select Payment Method',
    image: <></>,
    amount: ''
  };

  const isDarkMode = useColorScheme() === 'dark';
  const [tabIndex, setTabIndex] = useState(-1);
  const [nftLoyaltyVisible, setNftLoyaltyVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [payObj, setPayObj] = useState(paymentMethodObj);
  const [currentOrder, setCurrentOrder] = useState({});

  const handlePress = () => setExpanded(!expanded);

  const [state, setState] = useReducer(
    (state: orderState, newState: Partial<orderState>) => ({
      ...state,
      ...newState,
    }),
    {
      step: 1,
      steps: {
        steps: 4,
        type: 'loyalty',
        step_description: [
          'Select Option'
        ]
      },
      tag: '',
      amount: 10000,
      order: 0,
      confirmation: 0,
      deal: 0,
      redeemed: false,
      selected: 0,
      tip: 0,
      show: false,
      deals: {
        nfts: [{
          headline: 'fdc'
        }]
      },
      crypto_prices: {
        "icp": 0,
        "btc": 0,
        "eth": 0,
        "ckbtc": 0,
        "cketh": 0,
      },
      crypto_holdings: {
        "icp": 0,
        "btc": 0,
        "eth": 0,
        "ckbtc": 0,
        "cketh": 0,
      }
    }
  );

  const [flow, setFlow] = useReducer(
    (state: orderFlows, newState: Partial<orderFlows>) => ({
      ...state,
      ...newState,
    }),
    {
      loyalty: {
        type: 'loyalty',
        steps: 4,
        step_description: [
          'Select Option',
          'Select Payment',
          'Confirm Payment',
          'Order Complete'
        ]
      },
      coupon: {
        type: 'coupon',
        steps: 3,
        step_description: [
          'Select Option',
          'Redeem Coupon',
          'Confirmation'
        ]
      },
      ticket: {
        type: 'ticket',
        steps: 3,
        step_description: [
          'Select Option',
          'Redeem Ticket',
          'Confirmation'
        ]
      }

    }
  );

  const imageLibrary = {
    panda_express_logo: require('./images/panda-express-logo.png'),
    panda_express_nft_1: require('./images/panda-nft-1.png'),
    panda_express_nft_2: require('./images/panda-nft-2.png'),
    amc_coupon_logo: require('./images/amc-logo.png'),
    amc_coupon_nft_1: require('./images/amc-coupon-nft-1.jpg'),
  }

  const loadDeals = async (tagId: string) => {    
    let orderRes = await callIC('/order/' + tagId);    
    let order = JSON.parse(orderRes.message);
    setCurrentOrder(order);
    
    let dealRes = await callIC('/deals/' + tagId + '/' + USER_ID);  
    let deals = JSON.parse(dealRes.message);
    let dls = deals;

    dls.forEach((e, i) => {
      deals[i].image = imageLibrary[e.image];
      deals[i].vendor_id = order.vendor_order_id;
    });

    setState({
      deals: {
        id: deals[0].vendor_metadata.vendor_id,
        name: deals[0].vendor_metadata.name,
        logo: deals[0].vendor_metadata.logo,
        order: order.vendor_order_id,
        nfts: deals,  
      }
    })
  }

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported()

      if (deviceIsSupported) {
        await NfcManager.start()
      }
    }

    checkIsSupported()
  }, [])

  useEffect(() => {
    initDF()
  }, [])

  const initDF = async () => {
    let coins = [
      "bitcoin",
      "internet-computer",
      "ethereum",
      "chain-key-bitcoin",
      "chain-key-ethereum"
    ]

    let prices = await getCryptoPrices(coins);

    setState({
      crypto_prices: {
        icp: prices['internet-computer'].usd,
        btc: prices['bitcoin'].usd,
        eth: prices['ethereum'].usd,
        ckbtc: prices['chain-key-bitcoin'].usd,
        cketh: prices['chain-key-ethereum'].usd,
      }
    })
  
    let res = await callIC('/bitcoin/balance/' + ADDRESS_BITCOIN);  
    let crypto_holdings = state.crypto_holdings;

    crypto_holdings.btc = Number((Number(res.message)/100000000).toFixed(8));
    console.log(crypto_holdings);
    setState({
      crypto_holdings: crypto_holdings,
    })
}

const getCryptoPrices = async (currencies: string[]) => {
    let ids = currencies.join(",");

    let prices = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd')
    .then((resp) => resp.json())
    .then((json) => { return json })
    .catch((error) => console.error(error))

    return prices;    
}


const callIC = async (path: string) => {
  let url = 'https://' + CANISTER + '.' + DOMAIN + path;
  
  let resp = await fetch(url)
    .then((resp) => resp.json())
    .then((json) => { return json; })
    .catch((error) => { return error })
    .finally(() => console.log('done'));

    return resp;
}

  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const tag = await NfcManager.getTag();
      if (tag.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecords = tag.ndefMessage;
        loadDeals(tag.id);

        let confirmNumber = Math.floor(Math.random() * (999999 - 10000 + 1) + 10000)
        setState({step: 1, show: true, tag: tag.id, confirmation: confirmNumber});

    }
      
    } catch (ex) {
      console.log('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  const scanNFC = () => {
    readNdef();
  }

  const hideDialog = () => {
    setVisible(false);
    setNftLoyaltyVisible(false);
    setState({deal: 0, show: false});
  }

  function ExploreWitHookExamples() {
    const goTo = useTabNavigation();
    const index = useTabIndex();

    setTabIndex(index)

    return (
      <></>
    );
  }

  function showLoyaltyNfts() {
    setNftLoyaltyVisible(true);
  }

  function ScreenWithText({ text }: { text: string }) {
    return (
      <View style={styles.screenWithText}>
        <Title>{text}</Title>
      </View>
    );
  }

  function handleChangeIndex(index: number) {

  }


  const cancelButtonPressed = () => {
    setState({step: 0, deal: 0, deals: {id: '', name: '', logo: '', nfts: [{headline: 'fdc'}]}, redeemed: false, show: false});
    setPayObj(paymentMethodObj);
    
  }
  
  const selectNFTButtonPressed = (deal: number, type: string, nft: {}, id: number) => {
    let order = currentOrder;

    if (nft.discount_type == "pct") {
      let discounted_order_amount = (order.order_amount - (order.order_amount * (nft.discount/100))).toFixed(2);

      order['discounted_order_amount'] = Number(discounted_order_amount);
      order['15pct_tip_amount'] = (discounted_order_amount * 0.15).toFixed(2);
      order['20pct_tip_amount'] = (discounted_order_amount * 0.20).toFixed(2);
      order['25pct_tip_amount'] = (discounted_order_amount * 0.25).toFixed(2);

      setCurrentOrder(order);
    }

    setState({deal: deal, steps: flow[type], selected: id});
  }

  const continueButton = () => {
    setState({step: state.step + 1});
  }

  const redeemButton = () => {
    setState({step: state.step + 2});
  }

  const totalPrice = (base: number, tip: number) => {
    let tippedAmount = tip > 0 ? base * (0.10 + (tip * 0.05)) : 0;    
    let total = (base + tippedAmount);
    let icp = (total / state.crypto_prices.icp).toFixed(2);
    let btc = (total / state.crypto_prices.btc).toFixed(6);
    let eth = (total / state.crypto_prices.eth).toFixed(6);
    let ckbtc = (total / state.crypto_prices.ckbtc).toFixed(6);
    let cketh = (total / state.crypto_prices.cketh).toFixed(6);

    let price = {
      tip: tippedAmount.toFixed(2),
      total: total.toFixed(2),
      icp: icp,
      btc: btc,
      eth: eth,
      ckbtc: ckbtc,
      cketh: cketh,
    }
    
    return price;
  }

  const LeftContent = () => <Avatar.Image size={50} source={imageLibrary[state.deals.logo]} style={{backgroundColor: 'black'}}/>

  return (
    <PaperProvider>
    <SafeAreaView style={styles.container}>
    <ImageBackground
        source={require('./images/zero2dapp.png')}
        style={{ width: '100%', opacity: 0.7, height: 160 }}>

    <Appbar.Header style={{ backgroundColor: 'transparent' }}>
       <Appbar.Content title="" />
    </Appbar.Header>
    </ImageBackground>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
      <>
        <View >
          <TabsProvider
            defaultIndex={0}
            onChangeIndex={handleChangeIndex} 
          >
            <Tabs>
              <TabScreen label="Pay">
                <></>
              </TabScreen>
              <TabScreen label="NFT">
                <></>
              </TabScreen>
              <TabScreen label="Crypto">
                <></>
              </TabScreen>
            </Tabs>
            <ExploreWitHookExamples />
          </TabsProvider>
          </View>

        {tabIndex == 0 && (
          <View style={styles.screenWithText}>
            <Button mode="outlined" onPress={scanNFC}>Scan Tag</Button>
         
            {state.deals.nfts.length && (
              <Portal>
                <Dialog visible={state.show}>
                  <View style={{margin: 20}}>
                  <Text style={{fontSize: 20}}>{state.deals.name} Order #0{state.deals.order}</Text>
                  <ProgressBar progress={state.step / state.steps.steps} style={{marginTop: 20, marginBottom: 10}}/>
                <Text style={{fontSize: 12}}>{state.steps.step_description[state.step - 1]}</Text>
                </View>
                  <Dialog.ScrollArea style={{maxHeight: 525}}>
                    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{marginTop: 20, marginBottom: 50}}>
                  
                      {state.step == 1 && (
                        <>
                          {state.deals.nfts.map((nft: [], i: number) => (
                            <>
                              <Card>
                                <Card.Title title={state.deals.name} left={LeftContent} titleStyle={{fontSize: 20, marginLeft: 15}} />
                                <Card.Cover source={nft.image} style={{backgroundColor: 'white', margin: 15}} />
                                <Card.Content>
                                  <Text variant="titleLarge" >{nft.headline}</Text>
                                  <Text variant="bodyMedium" style={{marginBottom: 10}}>{nft.description}</Text>
                                </Card.Content>
                                <Card.Actions style={{flex: 1, flexDirection: "row"}}>
                                <View style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                  <View>
                                    {nft.deal_type === 'loyalty' && (
                                      <Chip>Deal</Chip>
                                    )}
                                    {nft.deal_type == 'coupon' && (
                                    <Chip>Coupon</Chip>
                                    )}
                                    {nft.deal_type == 'ticket' && (
                                    <Chip>Ticket</Chip>
                                    )}
                                    </View>
                                    <View>
                                      <Button style={{ alignSelf: 'flex-end' }} mode={state.deal == nft.deal_id ? 'contained' : 'outlined'} onPress={() => selectNFTButtonPressed(nft.deal_id, nft.deal_type, nft, i)}>Select</Button>
                                    </View>
                                  </View>
                                </Card.Actions>
                              </Card>
                              <Divider style={{margin: 20}} />
                            </>
                          ))}
                        </>
                      )}      

                      {(state.step == 2 && state.steps.type == 'loyalty') && (
                        <>
                          <DataTable>
                            <DataTable.Row>
                              <DataTable.Cell>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Purchase</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric><Text  style={{fontSize: 20, fontWeight: 'bold'}}>${currentOrder.discounted_order_amount}</Text></DataTable.Cell>
                            </DataTable.Row>
                            
                            <DataTable.Row>
                              <DataTable.Cell>
                                <Text style={{fontSize: 16, color: 'green'}}>10% NFT Discount applied</Text>
                              </DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row style={{borderBottomWidth: 0}}>
                              <DataTable.Cell>
                                <Text style={{fontSize: 16}}>Add tip</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric>

                              </DataTable.Cell>
                              <DataTable.Cell numeric>

                                {state.tip == 0 && (
                                  <Text>$0.00</Text>
                                )}
                                {state.tip == 1 && currentOrder.hasOwnProperty("15pct_tip_amount") && (
                                  <Text>${currentOrder['15pct_tip_amount']}</Text>
                                )}
                                {state.tip == 2 && currentOrder.hasOwnProperty("15pct_tip_amount") && (
                                  <Text>${currentOrder['20pct_tip_amount']}</Text>
                                )}
                                {state.tip == 3 && currentOrder.hasOwnProperty("15pct_tip_amount") && (
                                  <Text>${currentOrder['25pct_tip_amount']}</Text>
                                )}
                                
                              </DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row style={{borderBottomWidth: 0, marginBottom: 15}}>
                              <DataTable.Cell>
                                <View style={{ flexDirection: "row", marginLeft: 5 }}>
                                  <Button labelStyle={{ marginHorizontal: 0, marginVertical: 5 }} mode={state.tip == 0 ? "contained": "outlined"} style={{borderBottomLeftRadius: 15, borderTopLeftRadius: 15, borderRadius: 0, height: 32}} onPress={() => setState({tip: 0})}>
                                    No tip
                                  </Button>
                                  <Button labelStyle={{ marginHorizontal: 0, marginVertical: 5 }} mode={state.tip == 1 ? "contained": "outlined"} style={{borderRadius: 0, height: 32}} onPress={() => setState({tip: 1})}>
                                    15%
                                  </Button>
                                  <Button labelStyle={{ marginHorizontal: 0, marginVertical: 5 }} mode={state.tip == 2 ? "contained": "outlined"} style={{borderRadius: 0, height: 32}} onPress={() => setState({tip: 2})}>
                                    20%
                                  </Button>
                                  <Button labelStyle={{ marginHorizontal: 0, marginVertical: 5 }} mode={state.tip == 3 ? "contained": "outlined"} style={{borderBottomRightRadius: 15, borderTopRightRadius: 15, borderRadius: 0, height: 32}} onPress={() => setState({tip: 3})}>
                                    25%
                                  </Button>
                                </View>
                              </DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row style={{borderColor: "rgb(120, 69, 172)", borderWidth: 1, borderBottomWidth: 1, borderBottomColor: "rgb(120, 69, 172)"}}>
                              <DataTable.Cell>
                                <Text style={{fontSize: 16, fontStyle: 'italic', fontWeight: 'bold'}}>Total</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric>
                              </DataTable.Cell>
                              <DataTable.Cell numeric >
                                <Text style={{fontSize: 16, fontStyle: 'italic', fontWeight: 'bold'}}>${totalPrice(currentOrder.discounted_order_amount, state.tip).total}</Text>
                              </DataTable.Cell>
                            </DataTable.Row>
                          </DataTable>

                          <List.Section title="">
                            <List.Accordion
                              title={payObj.title}
                              left={() => payObj.image}
                              right={() => <Text>{payObj.amount}</Text>}
                              style={{backgroundColor: "rgb(120, 69, 172)"}}
                              expanded={expanded}
                              onPress={handlePress}>
                            <List.Item
                              title="ICP"
                              description=""
                              left={props => <Image source={require('./images/icp.png')} style={{width: 30, height: 30}}/>}
                              right={() => <Text>
                                {totalPrice(currentOrder.discounted_order_amount, state.tip).icp} ICP
                                </Text>}
                                onPress={() => {
                                  let obj = {
                                    id: 0,
                                    title: 'ICP',
                                    image: <Image source={require('./images/icp.png')} style={{width: 30, height: 30, marginLeft: 10}}/>,
                                    amount: totalPrice(currentOrder.discounted_order_amount, state.tip).icp + ' ICP'
                                  }
                                  setPayObj(obj)
                                  setExpanded(false)
                                }}
                              />
                            <List.Item
                              title="Bitcoin"
                              description=""
                              left={props => <Image source={require('./images/bitcoin.png')} style={{width: 30, height: 30}}/>}
                              right={() => <Text>{totalPrice(currentOrder.discounted_order_amount, state.tip).btc} BTC</Text>}
                              onPress={() => {
                                let obj = {
                                  id: 1,
                                  title: 'Bitcoin',
                                  image: <Image source={require('./images/bitcoin.png')} style={{width: 30, height: 30, marginLeft: 10}}/>,
                                  amount: totalPrice(currentOrder.discounted_order_amount, state.tip).btc + ' BTC'
                                }
                                setPayObj(obj)
                                setExpanded(false)
                              }}
                            />
                            <List.Item
                              title="Ethereum"
                              description=""
                              left={props => <Image source={require('./images/ethereum.png')} style={{width: 30, height: 30}}/>}
                              right={() => <Text>{totalPrice(currentOrder.discounted_order_amount, state.tip).eth} ETH</Text>}
                              onPress={() => {
                                let obj = {
                                  id: 2,
                                  title: 'Ethereum',
                                  image: <Image source={require('./images/ethereum.png')} style={{width: 30, height: 30, marginLeft: 10}}/>,
                                  amount: totalPrice(currentOrder.discounted_order_amount, state.tip).eth + ' ETH'
                                }
                                setPayObj(obj)
                                setExpanded(false)
                              }}
                            />
                            <List.Item
                              title="ckBTC"
                              description=""
                              left={props => <Image source={require('./images/ckbtc.png')} style={{width: 30, height: 30}}/>}
                              right={() => <Text>{totalPrice(currentOrder.discounted_order_amount, state.tip).ckbtc} ckBTC</Text>}
                              onPress={() => {
                                let obj = {
                                  id: 3,
                                  title: 'ckBTC',
                                  image: <Image source={require('./images/ckbtc.png')} style={{width: 30, height: 30, marginLeft: 10}}/>,
                                  amount: totalPrice(currentOrder.discounted_order_amount, state.tip).ckbtc + ' ckBTC'
                                }
                                setPayObj(obj)
                                setExpanded(false)
                              }}
                            />
                            <List.Item
                              title="ckETH"
                              description=""
                              left={props => <Image source={require('./images/cketh.png')} style={{width: 30, height: 30}}/>}
                              right={() => <Text>{totalPrice(currentOrder.discounted_order_amount, state.tip).cketh} ckETH</Text>}
                              onPress={() => {
                                let obj = {
                                  id: 4,
                                  title: 'ckETH',
                                  image: <Image source={require('./images/cketh.png')} style={{width: 30, height: 30, marginLeft: 10}}/>,
                                  amount: totalPrice(currentOrder.discounted_order_amount, state.tip).cketh + ' ckETH'
                                }
                                setPayObj(obj)
                                setExpanded(false)
                              }}
                            />
                            </List.Accordion>
                          </List.Section>
                          </>
                        )}

                        {(state.step == 2 && state.steps.type == 'coupon') && (
                          <>
                            <View style={{width: '100%', alignItems: 'center', marginTop: 5, marginBottom: 10}}>
                            <Image source={state.deals.nfts[state.selected].image} style={{height: 200, width: 400}} />
                            </View>
                            <View style={{width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 5}}>
                            <Text style={{fontSize: 22}}>{state.deals.nfts[state.selected].headline}</Text>
                            </View>
                            <View style={{width: '100%', alignItems: 'center', marginTop: 5, marginBottom: 10}}>
                            <Text style={{fontSize: 14, marginBottom: 10}}>{state.deals.nfts[state.selected].description}</Text>
                              <Text style={{fontStyle: 'italic', color: 'grey'}}>Note: This is a single-use coupon, and it will be removed from your wallet when it has been redeemed. </Text>
                            </View>
                            <View style={{width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 5}}>
                            <Button mode={state.redeemed ? 'contained' : 'outlined'} onPress={() => setState({redeemed: true})} style={{width: 200}}>Use Coupon</Button>
                            </View>
                          </>
                        )}

                        {state.step == 3 && (
                          <>
                            <DataTable>
                              <DataTable.Row style={{borderBottomWidth: 0}}>
                                <DataTable.Cell>
                                  <Text style={{fontSize: 16, color: 'grey'}}>Purchase</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric><Text  style={{fontSize: 16, color: 'grey'}}>${currentOrder.discounted_order_amount}</Text></DataTable.Cell>
                              </DataTable.Row>
                              
                              
                              <DataTable.Row style={{borderBottomWidth: 0}}>
                                <DataTable.Cell>
                                  <Text style={{fontSize: 16, color: 'grey'}}>Tip</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>

                                </DataTable.Cell>
                                <DataTable.Cell numeric><Text style={{fontSize: 16, color: 'grey'}}>${totalPrice(currentOrder.discounted_order_amount, state.tip).tip}</Text></DataTable.Cell>
                              </DataTable.Row>
                              <DataTable.Row style={{borderBottomWidth: 0}}>
                                <DataTable.Cell>
                                  <Text style={{fontSize: 16, fontWeight: 'bold', color: 'grey'}}>Total</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric><Text  style={{fontSize: 16, fontWeight: 'bold', color: 'grey'}}>${totalPrice(currentOrder.discounted_order_amount, state.tip).total}</Text></DataTable.Cell>
                              </DataTable.Row>
                              
                              <DataTable.Row style={{backgroundColor: "rgb(120, 69, 172)", borderBottomWidth: 0}}>
                              <DataTable.Cell>
                                  {payObj.image}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                <Text style={{fontWeight: 'bold'}}>{payObj.amount}</Text>
                                  </DataTable.Cell>
                              </DataTable.Row>
                            
                              <DataTable.Row style={{borderBottomWidth: 0}}>
                              <DataTable.Cell>
                                  <Text style={{fontSize: 16, fontStyle: 'italic'}}>Your wallet will be charged {payObj.amount}</Text>
                                </DataTable.Cell>
                              </DataTable.Row>
                              <DataTable.Row style={{borderBottomWidth: 0}}>
                                <DataTable.Cell>
                                  <Text style={{fontSize: 16, color: 'green'}}>10% NFT Discount applied</Text>
                                </DataTable.Cell>
                              </DataTable.Row>
                            </DataTable>
                          </>
                        )}

                        {state.step == 4 && (
                          <>
                            <View style={{width: '100%', alignItems: 'center', marginTop: 40, marginBottom: 50}}>
                              <Image source={require('./images/check_sign.png')} style={{width: 200, height: 200}}/>
                            </View>
                            <View style={{width: '100%', alignItems: 'center', marginTop: 0, marginBottom: 50}}>
                              <Text style={{fontSize: 36}}>Order Complete</Text>
                              <Text style={{fontSize: 20, margin: 10}}>Confirmation: #{state.confirmation}</Text>
                            </View>
                          </>
                        )}
                      </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                      <Button mode='outlined' onPress={cancelButtonPressed} style={{width: 100}}>{state.step == 4 ? 'Close' : 'Cancel'}</Button>
                      {state.step == 1 && (
                        <Button mode='contained' onPress={continueButton} style={{width: 100}}>Continue</Button>
                      )}
                      {state.step == 2 && state.steps.type == 'loyalty'  && (
                        <Button mode='contained' onPress={continueButton} style={{width: 100}}>Continue</Button>
                      )}
                      {state.step == 2 && state.steps.type == 'coupon' && (
                        <Button mode='contained' onPress={redeemButton} style={{width: 125, backgroundColor: 'green'}}><Text style={{color: 'white'}}>Redeem Now</Text></Button>
                      )}
                      {state.step == 3 && (
                        <Button mode='contained' onPress={continueButton} style={{width: 125, backgroundColor: 'green'}}><Text style={{color: 'white'}}>Pay Now</Text></Button>
                      )}
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              )}
            </View>
          )}

          {tabIndex == 1 && (
            <ListNFT showNfts={showLoyaltyNfts} />
          )}

          {tabIndex == 2 && (
            <ListCrypto props={state.crypto_holdings} />
          )}
     
          <Portal>
            <NFTModal userId='' partnerId='' list={true} amount={0} visibility={nftLoyaltyVisible} closing={hideDialog} />
          </Portal>
        </>
      </ScrollView>
    </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 300,
  },
  screenWithText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    minHeight: 200,
    maxHeight: 200,
  },
  surface: {
    padding: 8,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  amcimage: {
    width: 85,
    height: 85
  },
});

export default App;
