/* ************************************************ */
/* ListCrypto shows all available currencies and    */
/* the holdings in each currency                    */
/* ************************************************ */

import React, { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import {
  Image,
} from 'react-native';

type CryptoHoldings = {
  icp: number,
  btc: number,
  eth: number,
  ckbtc: number,
  cketh: number,
};

export default function ListCrypto(props): React.JSX.Element {
  
  return (
    <>
      <DataTable.Row>
       <DataTable.Cell > </DataTable.Cell>
       <DataTable.Cell numeric> </DataTable.Cell>
     </DataTable.Row>
      <DataTable.Row>
      <DataTable.Cell style={{flex: 0.5}}><Image source={require('../images/icp.png')} style={{width: 35, height: 35}}/></DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} >ICP</DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} numeric>{props.props.icp}</DataTable.Cell>
     </DataTable.Row>
     <DataTable.Row>
     <DataTable.Cell style={{flex: 0.5}}><Image source={require('../images/bitcoin.png')} style={{width: 35, height: 35}}/></DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}}>Bitcoin</DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} numeric>{props.props.btc}</DataTable.Cell>
     </DataTable.Row>
     <DataTable.Row>
     <DataTable.Cell style={{flex: 0.5}}><Image source={require('../images/ethereum.png')} style={{width: 35, height: 35}}/></DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} >Ethereum</DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} numeric>{props.props.eth}</DataTable.Cell>
     </DataTable.Row>
     <DataTable.Row>
     <DataTable.Cell style={{flex: 0.5}}><Image source={require('../images/ckbtc.png')} style={{width: 35, height: 35}}/></DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} >ckBTC</DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} numeric>{props.props.ckbtc}</DataTable.Cell>
     </DataTable.Row>
     <DataTable.Row>
     <DataTable.Cell style={{flex: 0.5}}><Image source={require('../images/cketh.png')} style={{width: 35, height: 35}}/></DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} >ckETH</DataTable.Cell>
       <DataTable.Cell textStyle={{fontSize:16}} numeric>{props.props.cketh}</DataTable.Cell>
     </DataTable.Row>
    </>
  )
}