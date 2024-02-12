/* ************************************************ */
/* ListNFT shows all NFTs for all vendors.          */
/* Categories: Loyalty, Coupons, Tickets            */
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
  showNfts: null
};

export default function ListNFT(props: NFTprops): React.JSX.Element {

    return (

<>
<DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell > </DataTable.Cell>

     </DataTable.Row>
     
<DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell ><Text variant="titleMedium">Loyalty</Text></DataTable.Cell>

     </DataTable.Row>

<DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
       <Avatar.Image size={65} source={require('../images/starbucks-logo.png')} />
  </Surface>
       </DataTable.Cell>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
       <Avatar.Image size={65} source={require('../images/macys-logo.jpg')} />
  </Surface>
       </DataTable.Cell>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
       <Image source={require('../images/johnny-rockets-logo.png')} style={{width: 75, height: 70}}/>
  </Surface>
       </DataTable.Cell>
     </DataTable.Row >
     <DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell > </DataTable.Cell>
       <DataTable.Cell > </DataTable.Cell>
       <DataTable.Cell numeric> </DataTable.Cell>
     </DataTable.Row>
<DataTable.Row  style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
       <Avatar.Image size={75} source={require('../images/nike-logo.png')} />
  </Surface>
       </DataTable.Cell>
       <DataTable.Cell onPress={props.showNfts}>
       <Surface style={styles.surface} elevation={4}>
       <Avatar.Image size={70} source={require('../images/panda-express-logo.png')} />
  </Surface>
       </DataTable.Cell>
       <DataTable.Cell >

       </DataTable.Cell>
     </DataTable.Row>

     <DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell > </DataTable.Cell>

     </DataTable.Row>
<DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell ><Text variant="titleMedium">Coupons</Text></DataTable.Cell>

     </DataTable.Row>

<DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
       <Avatar.Image size={65} source={require('../images/starbucks-logo.png')} />
  </Surface>
       </DataTable.Cell>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
       <Avatar.Image size={65} source={require('../images/amc-logo.png')} style={{backgroundColor: 'black'}} />
  </Surface>
       </DataTable.Cell>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
       <Image source={require('../images/Hard_Rock_Cafe_Logo.png')} style={{width: 75, height: 45}}/>
  </Surface>
       </DataTable.Cell>
     </DataTable.Row >
     <DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell > </DataTable.Cell>
       <DataTable.Cell > </DataTable.Cell>
       <DataTable.Cell numeric> </DataTable.Cell>
     </DataTable.Row>



<DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell ><Text variant="titleMedium">Tickets</Text></DataTable.Cell>

     </DataTable.Row>

<DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
       <Image source={require('../images/amc-logo.png')} style={styles.amcimage}/>
  </Surface>
       </DataTable.Cell>
       <DataTable.Cell >
       <Surface style={styles.surface} elevation={4}>
    
  </Surface>
       </DataTable.Cell>
       <DataTable.Cell >

       </DataTable.Cell>
     </DataTable.Row >
     <DataTable.Row style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell > </DataTable.Cell>
       <DataTable.Cell > </DataTable.Cell>
       <DataTable.Cell numeric> </DataTable.Cell>
     </DataTable.Row>
<DataTable.Row  style={{borderBottomColor: "#000000"}}>
       <DataTable.Cell >

       </DataTable.Cell>
       <DataTable.Cell >

       </DataTable.Cell>
       <DataTable.Cell >

       </DataTable.Cell>
     </DataTable.Row>
</>
    )
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
      // backgroundColor: 'pink',
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
      width: 65,
      height: 65
    },
  });