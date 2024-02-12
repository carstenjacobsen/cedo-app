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

import LoyaltyNFT from './LoyaltyNFT';

type NFTprops = {
  userId: string;
  partnerId: string;
  amount: number;
  list: boolean;
  visibility: {};
  closing: {};
};
type NFTModalProps = {
  userId: string;
  partnerId: string;
  visibility: false;
  closing: {}
};

export default function NFTModal(props: NFTprops): React.JSX.Element {
  const [visible, setVisible] = useState(true)

    return (
        <>
          <Dialog visible={props.visibility}>
              <View style={{margin: 20}}>
    
            <Text style={{fontSize: 20}}>Your NFT Deals</Text>
            </View>
              <Dialog.ScrollArea style={{height: 470}}>
                <ScrollView contentContainerStyle={{paddingHorizontal: 0, height: 1000, marginTop: 20}}>
                
                <LoyaltyNFT userId={'123'} partnerId={'234'} amount={100000} list={true} />
                
                </ScrollView>
        </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button mode='outlined' onPress={props.closing}>Close</Button>
              </Dialog.Actions>
            </Dialog>
        </>
    )


}