/* ************************************************ */
/* DealNFT gets all NFT deals redeemable for the   */
/* scanned tag                                      */
/* ************************************************ */

import React, { useState, useEffect } from 'react';
import { PaperProvider, 
  Appbar, 
  Button, Dialog, Portal, Text, Title, Paragraph, DataTable, Surface, 
  Card, ProgressBar, List,
  Avatar, SegmentedButtons, Divider
} from 'react-native-paper';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Image,
} from 'react-native';

type NFTprops = {
  userId: string;
  partnerId: string;
  amount: number;
  list: boolean;
  selectDeal: {};
};

export default function DealNFT(props: NFTprops): React.JSX.Element {

    const LeftContent = () => <Avatar.Image size={50} source={require('../images/panda-express-logo.png')} />

    console.log('amount: ' + props.amount.toString());
    

    return (
        <>
      <Card>
        <Card.Title title="Panda Express" left={LeftContent} titleStyle={{fontSize: 20, marginLeft: 15}} />
        <Card.Cover source={ require('../images/panda-nft-1.png') } style={{backgroundColor: 'white', margin: 15}} />
        <Card.Content>
          <Text variant="titleLarge">10% Off Discount</Text>
          <Text variant="bodyMedium" style={{marginBottom: 10}}>Get 10% off your order (pre-tax & tips) when you select this loyalty NFT. Restrictions may apply. At participating restaurants only.</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={props.selectDeal(1)}>Select</Button>
        </Card.Actions>
      </Card>
      {(props.amount >= 35 || props.list)  && (
        <>
            <Divider style={{margin: 20}} />
            <Card>
            <Card.Title title="Panda Express" left={LeftContent} titleStyle={{fontSize: 20, marginLeft: 15}} />
            <Card.Cover source={ require('../images/panda-nft-2.png') } style={{backgroundColor: 'white', margin: 15}} />
            <Card.Content>
                <Text variant="titleLarge">$5 Off Orders Of $35</Text>
                <Text variant="bodyMedium">Get $5 off any order of $35 or more (pre-tax & tips) when you select this loyalty NFT. Restrictions may apply. At participating restaurants only.</Text>
            </Card.Content>
            <Card.Actions>
                <Button onPress={props.selectDeal(2)}>Select</Button>
            </Card.Actions>
            </Card>
        </>
    )}
    </>
    )


}