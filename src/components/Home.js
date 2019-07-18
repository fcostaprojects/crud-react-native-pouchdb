/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";

import * as Database from '../db/database';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this._remove = this._remove.bind(this);
    this._prepareList();
  }

  _prepareList() {
    let { width } = Dimensions.get("window");

    this.ds = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    this._layoutProvider = new LayoutProvider((i) => {
      return "A";
    }, (type, dim) => {
      dim.width = width;
      dim.height = 60;
    });

    this.state = { dataProvider: this.ds.cloneWithRows([]) };
    this._rowRender = this._rowRender.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (Actions.currentScene === 'home') ? true : false;
  }

  _searchAll() {
    const bookDb = Database.getBookDb();
    bookDb.allDocs({
      include_docs: true,
      inclusive_end: true
    }).then(books => {
      if (!books) return;
      const rows = books.rows;
      this.setState({ dataProvider: this.ds.cloneWithRows(rows) });
    })
  }

  componentDidMount() {
    this._searchAll();
  }

  _remove(item) {
    const bookDb = Database.getBookDb();
    bookDb.remove(item).then(() => {
      this._searchAll();
    })
  }

  _renderRecyclerListView() {
    return (
      <RecyclerListView
        rowRenderer={this._rowRender}
        dataProvider={this.state.dataProvider}
        layoutProvider={this._layoutProvider}
      />
    )
  }

  _rowRender(type, item) {
    return (
      <View style={styles.itemList}>
        <View style={styles.vwText}>
          <Text style={styles.txtDetail}>{item.doc.name}</Text>
        </View>
        <View style={styles.vwButtons}>
          <Button transparent onPress={() => { this._remove(item.doc) }}>
            <Icon type="FontAwesome" name='trash' style={styles.icon} />
          </Button>
          <Button transparent onPress={() => Actions.editBook({ item: item.doc })}>
            <Icon type="FontAwesome" name='edit' style={styles.icon} />
          </Button>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left>
            <Button transparent >
              <Icon type="FontAwesome" name='bars' />
            </Button>
          </Left>
          <Body>
            <Title>Crud RN PouchDB</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.editBook()}>
              <Icon type="FontAwesome" name='plus-square' />
            </Button>
          </Right>
        </Header>

        <View style={styles.container}>
          {this._renderRecyclerListView()}
        </View>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#273472',
  },
  header: {
    backgroundColor: '#0d1125'
  },
  itemList: {
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#273472',
  },
  vwLine: {
    flexDirection: 'row',
  },
  vwButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  vwText: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 22,
    color: '#fff'
  },
  txtDetail: {
    color: '#fff'
  }
});
